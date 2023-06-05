require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dns = require('dns')
const url = require('url')
const bodyParser = require('body-parser')
const app = express()

// Basic Configuration
const port = process.env.PORT || 3000

app.use(cors())

app.use(bodyParser.urlencoded({ extended: 'false' }))
app.use(bodyParser.json())

app.use('/public', express.static(`${process.cwd()}/public`))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString))
  } catch (e) {
    return false
  }
}

const shorturl = {}
let index = 1
// Your first API endpoint
app
  .post('/api/shorturl', function (req, res) {
    console.log('req.body', req.body)
    const q = url.parse(req.body.url)
    if (!isValidUrl(q.host)) {
      res.json({ error: 'invalid url' })
      return
    }
    if (!shorturl[req.body.url]) {
      shorturl[req.body.url] = index
      shorturl[index] = req.body.url
      index++
    }
    res.json({
      original_url: req.body.url,
      short_url: shorturl[req.body.url],
    })
  })
  .get('/api/shorturl/:shorturl', function (req, res) {
    console.log('req.params', req.params)
    if (shorturl[req.params.shorturl]) {
      res.redirect(shorturl[req.params.shorturl])
    } else {
      res.json({ error: 'invalid url' })
    }
  })

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
