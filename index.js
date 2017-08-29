const request = require('request-promise')
const cheerio = require('cheerio')
const express = require('express')
const WebSocket = require('ws')
const http = require('http')
const url = require('url')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const BASE = 'https://clwo.eu/'

async function get_comments(from) {
  // Returns last 20 comments from either the last comment or specified 'to' value.
  const body = await request(`${BASE}xmlhttp.php?action=dvz_sb_recall&first=${from || 1000000}`)
  const $ = cheerio.load(JSON.parse(body).html)

  let entries = []
  $('.entry').each(function(index, element) {
    entries.push(parse_entry(this))
  })

  return entries
}

function parse_entry(html) {
  return {
    id: cheerio(html).attr('data-id'),
    avatar: url.resolve(BASE, cheerio('.avatar img', html).attr('src')),
    profile: cheerio('.user a', html).attr('href'),
    name: cheerio('.user a', html).text(),
    text: cheerio('.text', html).text(),
    permalink: cheerio('.info a', html).attr('href'),
    date: cheerio('.info a .date', html).text()
  }
}

app.get('/get_comments', async (req, res) => {
  res.json({ data: await get_comments(req.query.from) })
})

wss.on('connection', (ws, req) => {
  console.log('A client connected to us.')
})

wss.broadcast = function(msg) {
  wss.clients.forEach((client) => {
    client.send(msg)
  })
}

let last_known = 0
setInterval(async () => {
  (await get_comments()).reverse().forEach((item) => {
    if (item.id > last_known) {
      last_known = item.id
      wss.broadcast(JSON.stringify(item))
    }
  })
}, 3000)

server.listen(3040, () => {
  console.log('App listening on port 3040.')
})
