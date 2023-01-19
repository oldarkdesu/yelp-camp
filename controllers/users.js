const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}
module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const new_user = new User({ email, username })
        const registered_user = await User.register(new_user, password)
        req.login(registered_user, err => {
            if (err)
                return next(err)
            req.flash('success', 'Welcome to yelp-camp!')
            res.redirect('/campgrounds')
        })
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}
module.exports.renderLoginForm = async (req, res, next) => res.render('users/login')
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const {returnTo = '/campgrounds'} = req.session
    delete req.session.returnTo;
    res.redirect(returnTo)
}
module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if(err)
            return next(err)
        req.flash('success', 'See ya :)')
        res. redirect('/home')
    })
}