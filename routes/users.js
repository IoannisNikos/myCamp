const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const wrapAsync = require('../utilities/wrapAsync');
const users = require('../controllers/users');

router.route('/register')
    .get(users.registrationForm)
    .post(wrapAsync(users.submitRegistration));

router.route('/login')
    .get(users.loginForm)
    .post(storeReturnTo, passport.authenticate(
        'local',
        { failureFlash: true, failureRedirect: '/login' }),
        users.submitLogin)

// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', 'Goodbye!');
//     res.redirect('/campgrounds');
// })

router.get('/logout', users.logout);

module.exports = router;