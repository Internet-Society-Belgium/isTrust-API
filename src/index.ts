import express from 'express'
import helmet from 'helmet'
import errorMiddleware from './middlewares/error'

import geolocationRoute from './routes/geolocation'

const app = express()
const PORT = process.env.PORT || '8080'

app.use(helmet())
app.use(errorMiddleware)

app.use('/geolocation', geolocationRoute)

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
