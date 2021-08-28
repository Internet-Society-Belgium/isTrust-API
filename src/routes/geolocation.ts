import { Router } from 'express'
import maxmind, { CountryResponse } from 'maxmind'

import { Geolocation } from '../types/geolocation'

import updateGeoLite2 from '../utils/updateGeoLite2'

const router = Router()

export default router.get('/', async (req, res) => {
    console.log(req.ip)

    const dbPath = await updateGeoLite2()

    const lookup = await maxmind.open<CountryResponse>(dbPath)
    try {
        const response = lookup.get(req.ip)
        if (!response?.country) return res.status(404)

        const geolocation: Geolocation = {
            country: {
                isoCode: response.country.iso_code,
            },
        }
        res.send(geolocation)
    } catch (e) {
        return res.status(404).send()
    }
})
