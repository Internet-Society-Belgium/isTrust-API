import express from 'express'
import helmet from 'helmet'

import errorMiddleware from './middlewares/error'

import certificateRoute from './routes/certificate'
import geolocationRoute from './routes/geolocation'

const app = express()
const PORT = process.env.PORT || '8080'

app.set('trust proxy', true)

app.use(helmet())
app.use(errorMiddleware)

app.use('/certificate', certificateRoute)
app.use('/geolocation', geolocationRoute)

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
