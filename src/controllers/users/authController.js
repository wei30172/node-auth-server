const User = require("../../models/User")
const jwt = require('jsonwebtoken')

// handle errors
const handleErrors = (err) => {
  // user validation failed: email: Please enter an email, password: Please enter a password
  let errors = { email: '', password: '' }

  // no email or password
  if (err.message === 'Please enter an email and password') {
    errors.password = 'The email and password are required';
  }
  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }
  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }
  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered'
    return errors
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }

  return errors
}

// create json web token
const maxAge = 3 * 24 * 60 * 60 // 3 days
const createToken = (id) => {
  return jwt.sign({ id }, 'node secret', {
    expiresIn: maxAge
  })
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.create({ email, password })
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user.email })
  }
  catch(err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user.email })
  }
  catch(err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  } 
}

// const jwtOption = {
//   maxAge: 1000 * maxAge, // 3 days
//   secure: true, // only be sent when we have HTTPS connection!!!
//   httpOnly: true // only be transformed via HTTP Protocol, not in the front-end JS code.(document.cookie)
// }