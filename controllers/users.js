const User=require('../models/user');

module.exports.registrationForm=(req, res) => {
    res.render('users/register');
}

module.exports.submitRegistration=async (req, res) => {
    try {
        const { email, username, password }=req.body;
        const user=new User({ email, username });
        // Validate user inputs
        const validationErrors=user.validateSync();
        if (validationErrors) {
            const errors=Object.values(validationErrors.errors).map((err) => err.message);
            req.flash('error', errors.join(', '));
            return res.redirect('/register');
        }
        const registeredUser=await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to myCamp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.loginForm=(req, res) => {
    res.render('users/login');
}

module.exports.submitLogin=(req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl=res.locals.returnTo||'/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/');
    });
}