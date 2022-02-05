const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes')
const cookieParser = require('cookie-parser')
const { checkUserAuth, removeAuth } = require('./middleware/authMiddleware');
const cors = require('cors')

const app = express()

// middleware
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
})) // for development!!!

// database connection
const CONNECTION_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@node-auth.ybm81.mongodb.net/node-auth`
const PORT = process.env.PORT || 5000

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose
  .connect(CONNECTION_URL, options)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch(error => {
    console.log(`${error} did not connect`)
  })

// routes
app.get('/', (req, res) => {
  res.send('Hello to Auth API')
})
app.get('/api/userAuth', checkUserAuth)
app.get('/api/logout', removeAuth)
app.use(authRoutes)