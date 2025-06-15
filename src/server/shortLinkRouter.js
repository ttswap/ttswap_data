import express from 'express'
import { randomBytes } from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()
const SHORT_LINKS_FILE = path.join(__dirname, 'shortLinks.json')

// Ensure the shortLinks.json file exists
if (!fs.existsSync(SHORT_LINKS_FILE)) {
  fs.writeFileSync(SHORT_LINKS_FILE, JSON.stringify({}))
}

// Read short links from file
const readShortLinks = () => {
  const data = fs.readFileSync(SHORT_LINKS_FILE, 'utf-8')
  return JSON.parse(data)
}

// Write short links to file
const writeShortLinks = (data) => {
  fs.writeFileSync(SHORT_LINKS_FILE, JSON.stringify(data, null, 2))
}

// Generate short link
router.post('/generate-short-link', (req, res) => {
  console.log('POST /generate-short-link', req.body)
  const { username, originalUrl } = req.body
  console.log('ddd', req.get('origin'),username, originalUrl)
  if (!username || !originalUrl) {
    return res.status(400).json({ success: false, error: 'Missing required fields' })
  }

  const shortId = randomBytes(4).toString('hex')
  const shortLinks = readShortLinks()

  shortLinks[shortId] = {
    originalUrl,
    username,
    createdAt: new Date().toISOString()
  }

  writeShortLinks(shortLinks)

  res.json({ success: true, shortUrl: `${req.get('origin')}/api/share/${shortId}` })
})

// Get short link data
router.get('/share/:id', (req, res) => {
  try {
    console.log('GET /short-link:shortId:', req.params.id)
    const id = req.params.id
    const shortLinks = readShortLinks()
    // console.log('shortLinks:', shortLinks)

    const linkData = shortLinks[id]
    console.log('linkData:', linkData)
    if (!linkData) {
      return res.status(404).json({ error: 'Short link not found' })
    }
    res.cookie('shareUser', linkData.username, {
      maxAge: 300 * 24 * 60 * 60 * 1000,
    })
    return res.redirect(linkData.originalUrl)
  } catch (error) {
    res.status(500).send('服务器错误')
  }
  // res.json(linkData)
})

export default router