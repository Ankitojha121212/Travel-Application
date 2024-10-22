const express = require('express');
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require('../schema.js');
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const Listing = require("../models/listing");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const cloudinary = require('cloudinary');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

////////// for index page route
router
    .route('/')
        .get(wrapAsync(listingController.index)) // for index route
        .post(
            upload.single('listing[image]'),
            validateListing,
            wrapAsync(listingController.createNewListing));//new route listing creation


  // new route for creating the new listing
  router.get("/new",isLoggedIn,listingController.renderNewForm);



   
 /////////// for id route page
 router
    .route("/:id")
        .put(
             isLoggedIn,
             isOwner,
             upload.single('listing[image]'),
             wrapAsync(listingController.updateListingDetails))// edit route
        .get( wrapAsync(listingController.showListing)) // show route
        .delete( isLoggedIn , isOwner,
            wrapAsync(listingController.deleteListing))// Delete Listing
        
 
 //update route
 router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.renderUpdateForm));
 


 module.exports = router;