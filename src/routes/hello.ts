import { Router } from 'express'

const router = Router()

export default router.get('/', async (req, res) => {
    res.send('Hello world')
})
