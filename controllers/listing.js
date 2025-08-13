const Listing = require("../models/listing.js");
//for index
module.exports.index = async (req, res) => {
  let allList = await Listing.find();
  res.render("./listing/index.ejs", { allList });
};

// for new  listing form

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

//for show  route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listing");
  }
  //   console.log(listing.reviews[0].author);
  res.render("listing/show.ejs", { listing });
};
//for create listing
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  //  console.log(url,"..",filename)
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listing");
};
//for edit form or edit listing
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // console.log(listing)
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listing");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  return res.render("listing/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  console.log("listing in working");
  req.flash("success", "Listing Updated!");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleted_listItem = await Listing.findByIdAndDelete(id);
  // console.log( deleted_listItem)
  req.flash("success", "Listing Deleted!");

  return res.redirect("/listing");
};
