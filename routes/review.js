const express = require("express")
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js")
let  wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpresError.js");
// let {reviewSchema} = require("../schema.js"); import  into another file
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js")

const reviewConroller = require("../controllers/review.js");

//  post review Route

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewConroller.createReview));

//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewConroller.destroyReview));


module.exports=router;