import { Router } from 'express'
import { Geolocation } from '../types/geolocation'
import { Reader } from '@maxmind/geoip2-node'
import updateGeoLite2 from '../utils/updateGeoLite2'

const router = Router()

export default router.get('/', async (req, res) => {
  console.log(req.ip) // app.set('trust proxy', true) ?

  const dbPath = await updateGeoLite2()

  const reader = await Reader.open(dbPath)
  try {
    const { country } = reader.country(req.ip)
    if (!country) return res.status(404)

    const geolocation: Geolocation = {
      country: {
        isoCode: country.isoCode,
      },
    }
    res.send(geolocation)
  } catch (e) {
    return res.status(404).send()
  }
})
