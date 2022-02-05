const jwt = require('jsonwebtoken')
const User = require('../models/User')

// check current user auth
const checkUserAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'node secret', async (err, decodedToken) => {
      if (err) {
        res.json({
          user: null,
          authVerify: false
        })
        next()
      } else {
        let user = await User.findById(decodedToken.id)
        res.json({
          user,
          authVerify: true
        })
        next()
      }
    });
  } else {
    res.json({
      user: null,
      authVerify: false
    })
    next()
  }
}

const removeAuth = (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.json({ logout: true })
  next()
}

module.exports = { checkUserAuth, removeAuth }