const User = require("../models/user")


module.exports.renderSignUpform = (req, res) => {
    res.render("./users/signup.ejs")
}

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }

            req.flash("success", "Welcome To WanderLust");
            res.redirect("/listing");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}


module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs")

};

module.exports.login =async(req, res) => {
    req.flash("success", "Welcome back to WanderLust!")
    let redirectUrl=res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged you out");
        res.redirect("/listing")
    });
}