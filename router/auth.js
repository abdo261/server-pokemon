const { loginUser } = require('../controller/authController')

const authRouter = require('express').Router()

authRouter.post('/login',loginUser)
module.exports = authRouter