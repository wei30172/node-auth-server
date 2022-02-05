const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  }
})

// fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
  next()
})

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  // using the normal function to use this keyword to refer to the instance of the user that we created
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// static method to login user
userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error('Please enter an email and password')
  }
  const user = await this.findOne({ email }) // refer to the user model
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user;
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect email')
};

const User = mongoose.model('user', userSchema)

module.exports = User