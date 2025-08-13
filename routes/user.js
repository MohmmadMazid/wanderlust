const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/user.js")

//signUp form
//singn up user
router.route("/signup")
.get(userController.renderSignUpform)
.post(wrapAsync(userController.signUp));




//login form
//login up user
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),userController.login)


    //logout route
router.get("/logout", userController.logout);

module.exports = router;