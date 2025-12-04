const Listing = require("../models/listing");

const getCoordinates = async (location) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        type: 'Point',
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
      };
    }
    return { type: 'Point', coordinates: [0, 0] }; // Default if not found
  } catch (error) {
    console.error("Geocoding error:", error);
    return { type: 'Point', coordinates: [0, 0] };
  }
};

module.exports.index = async (req, res) => {
  let { q } = req.query;
  let allListings;
  if (q) {
    allListings = await Listing.find({ title: { $regex: q, $options: "i" } });
  } else {
    allListings = await Listing.find({});
  }
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
    .populate("owner");
  if (!listing) {
    req.flash("error", "NOT FOUND");
    res.redirect("/listings");
    return;
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = await getCoordinates(newListing.location);

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "NOT FOUND");
    res.redirect("/listings");
    return;
  }
  let orignialImageUrl = listing.image.url;
  orignialImageUrl = orignialImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, orignialImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.body.listing.location !== listing.location) {
    listing.geometry = await getCoordinates(req.body.listing.location);
  }

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  await listing.save();
  req.flash("success", " Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing Deleted");
  res.redirect("/listings");
};