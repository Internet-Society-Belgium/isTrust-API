import express from 'express'
import helmet from 'helmet'
import errorMiddleware from './middlewares/error'

const app = express()
const PORT = process.env.PORT || '8080'

app.use(helmet())

app.use(errorMiddleware)

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
