import express from 'express'
import bodyParser from 'body-parser'

import routerViews from './views'

const port = process.env.PORT || 3000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', routerViews)
app.listen(port, () => {
  console.log(`listening at port ${port}`)
})
