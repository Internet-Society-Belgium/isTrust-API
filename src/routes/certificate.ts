import { Router } from 'express'
import https from 'https'
import tls from 'tls'

import {
    InvalidCertificate,
    Owner,
    ValidCertificate,
} from '../types/certificate'

const router = Router()

export default router.get('/', async (req, res, next) => {
    const url = req.query.url as string
    if (!url) return res.sendStatus(400)

    let host: string

    try {
        host = new URL(url).host
    } catch (e) {
        return res.sendStatus(400)
    }

    const request = https.request(
        {
            host,
            port: 443,
            agent: new https.Agent({
                maxCachedSessions: 0,
            }),
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0', Accept: '' },
            rejectUnauthorized: false,
            timeout: 3000,
        },
        (response) => {
            const socket = response.socket as tls.TLSSocket

            const valid = socket.authorized

            if (!valid) {
                const authorizationError = socket.authorizationError

                const invalidCertificate: InvalidCertificate = {
                    valid: false,
                    error: authorizationError.toString(),
                }

                res.send(invalidCertificate)
                return
            }

            const protocol = socket.getProtocol()
            if (!protocol) {
                next('no protocol')
                return
            }

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

            res.send(validCertificate)
        }
    )
    request.on('error', (e) => {
        next(e)
        return
    })
    request.end()
})
