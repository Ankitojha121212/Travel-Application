const Listing = require("../models/listing");
const Review = require("../models/review");
module.exports.addNewReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!!");
        return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user._id;

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Added!!!");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.deleteReview = async(req,res)=>{
    let{id,reviewId} = req.params;
   await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
     await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted !!!");
     res.redirect(`/listings/${id}`);

};