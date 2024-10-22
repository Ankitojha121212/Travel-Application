const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require('./schema.js');
const Review = require("./models/review.js");
module.exports.isLoggedIn  = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.flash("error","Please Login or Signup !!");
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit !!");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId);
    if( !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not author !!");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}

/// making server side validator function for validating the listing information from server side by joi
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((e)=>el.message).join(',');
        throw new ExpressError(400, error);
    }else{
        next();
    }
}


// / making server side validator function for validating the review information from the server side by joi

