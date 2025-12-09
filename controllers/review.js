const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    newreview.image = { url, filename };
  }
  newreview.author = req.user._id;
  listing.reviews.push(newreview);
  await newreview.save();
  await listing.save();
  req.flash("success", "New Review Created");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted");
  res.redirect(`/listings/${id}`);
};