const express = require('express')
const router = express.Router()
const passport = require('passport')
const wrapAsync = require('../utils/wrapAsync')
const { ensureLogin } = require('../middleware')
const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegisterForm)
    .post(wrapAsync(users.registerUser))

/* Login */
router.route('/login')
    .get(users.renderLoginForm)
    .post(
        passport.authenticate('local', { 
            failureRedirect:'/login', 
            failureFlash: true,
            keepSessionInfo: true,
        }),
        users.login)

/* Logout */
router.get('/logout', ensureLogin, users.logout)

module.exports = router