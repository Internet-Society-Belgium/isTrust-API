import { NextFunction, Request, Response } from 'express'

import HttpException from '../types/error'

function errorMiddleware(
    error: HttpException,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): void {
    const status = error.status || 500
    const message = error.message || 'Something went wrong'

    if (process.env.NODE_ENV === 'development') {
        response.status(status).send(message)
    } else {
        response.sendStatus(status)
    }
}

export default errorMiddleware
