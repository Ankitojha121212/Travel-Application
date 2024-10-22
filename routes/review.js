const express = require("express");
const router = express.Router({mergeParams : true});


const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require('../schema.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { addNewReview, deleteReview } = require("../controllers/reviews.js");


// const validateReview = require("../middleware.js");


// middleware to handling the errors
const validateReview =  (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((e)=> e.message).join(',');
        throw new ExpressError(400,errMsg);
        
    }else{
        next();
    }
};


/////////// //////////////////// Review route
// Review route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(addNewReview));


// Delete Review Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(deleteReview));

module.exports = router;

