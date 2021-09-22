import express from 'express'
import helmet from 'helmet'
import serverless from 'serverless-http'

import helloRoute from './routes/hello'

const app = express()

app.use(helmet())

app.use('/hello', helloRoute)

module.exports.handler = serverless(app)
