import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import https from 'https'
import tls from 'tls'

import {
    InvalidCertificate,
    Owner,
    ValidCertificate,
} from '../types/certificate'

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const param_url = event.queryStringParameters?.url
    if (!param_url) return sendStatus(400)

    let host: string

    try {
        const url = new URL(param_url)
        if (url.protocol !== 'https:') {
            const invalidCertificate: InvalidCertificate = {
                valid: false,
                error: 'Wrong protocol',
            }
            return send(invalidCertificate)
        }
        host = url.host
    } catch (e) {
        return sendStatus(400)
    }

    try {
        const certificate = await getCertificate(host)
        return send(certificate)
    } catch (e) {
        const status = e as number
        return sendStatus(status || 500)
    }
}

function getCertificate(
    host: string
): Promise<InvalidCertificate | ValidCertificate> {
    return new Promise(function (resolve, reject) {
        const request = https.request(
            {
                host,
                port: 443,
                agent: false,
                method: 'HEAD',
                headers: { 'User-Agent': 'Mozilla/5.0', Accept: '' },
                rejectUnauthorized: false,
                timeout: 2500,
            },
            (response) => {
                const socket = response.socket as tls.TLSSocket

                const valid = socket.authorized

                if (!valid) {
                    const authorizationError = socket.authorizationError

                    const invalidCertificate: InvalidCertificate = {
                        valid: false,
                        error: `${authorizationError.toString()}`,
                    }

                    return resolve(invalidCertificate)
                }

                const protocol = socket.getProtocol()
                if (!protocol) return sendStatus(500)

                const validCertificate: ValidCertificate = {
                    valid: true,
                    protocol,
                }

                const cert = socket.getPeerCertificate(false)
                const {
                    O: organisation,
                    C: country,
                    ST: region,
                    L: state,
                } = cert.subject

                if (organisation) {
                    const owner: Owner = {
                        organisation,
                    }
                    if (country && region && state) {
                        owner.location = {
                            state,
                            region,
                            country,
                        }
                    }
                    validCertificate.owner = owner
                }

                return resolve(validCertificate)
            }
        )
        request.on('timeout', () => {
            return reject(504)
        })
        request.on('error', (err: Error & { code?: number }) => {
            const invalidCertificate: InvalidCertificate = {
                valid: false,
                error: `${err?.code || 'Secure Connection Failed'}`,
            }

            return resolve(invalidCertificate)
        })
        request.end()
    })
}

function send(data: unknown) {
    const body: string = typeof data === 'string' ? data : JSON.stringify(data)

    return {
        isBase64Encoded: false,
        statusCode: 200,
        body,
        headers: {
            'content-type': 'application/json',
        },
    }
}

function sendStatus(status: number) {
    const statusCode = status || 500
    const body =
        statusCode === 400
            ? 'Bad Request'
            : statusCode === 502
            ? 'Bad Gateway'
            : statusCode === 504
            ? 'Gateway Timeout'
            : 'Internal Server Error'
    return {
        isBase64Encoded: false,
        statusCode,
        body,
        headers: {
            'content-type': 'application/json',
        },
    }
}
