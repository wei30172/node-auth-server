const { Router } = require('express')
const authController = require('../controllers/users/authController')

const router = Router()

router.post('/api/signup', authController.signup_post)
router.post('/api/login', authController.login_post)

module.exports = router