import express from 'express'
import { checkStepOne } from '../modules/stepChecker'

const router = new express.Router()

router.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

router.post('/', async (req, res) => {
    const result = await checkStepOne(req.body.gitusername)
    res.send(result ? 'Success!' : 'Sorry. Try again.')
})

export default router
