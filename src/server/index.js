import express from 'express'
import shortLinkRouter from './shortLinkRouter.js'

const app = express()
const port = process.env.PORT || 3001

// 添加 JSON 解析中间件
app.use(express.json())

// 添加 CORS 中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// 使用 /api 前缀
app.use('/api', shortLinkRouter)

app.listen(port, () => {
  console.log(`Short link server running at http://localhost:${port}`)
})