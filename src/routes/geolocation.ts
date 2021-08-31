import { Router } from 'express'
import maxmind, { CityResponse } from 'maxmind'

import { Geolocation } from '../types/geolocation'

import updateGeoLite2 from '../utils/updateGeoLite2'

const router = Router()

export default router.get('/', async (req, res, next) => {
    const dbPath = await updateGeoLite2()

    const lookup = await maxmind.open<CityResponse>(dbPath)
    try {
        const response = lookup.get(req.ip)
        if (!response) return res.sendStatus(404)

        const isoCode = response.country?.iso_code
        if (!isoCode) return res.sendStatus(404)

        const geolocation: Geolocation = {
            country: {
                isoCode,
            },
            location: {
                latitude: response.location?.latitude,
                longitude: response.location?.longitude,
            },
        }
        res.send(geolocation)
    } catch (e) {
        next(e)
        return
    }
})
