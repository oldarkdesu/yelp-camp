const Campground = require("../models/campground")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN })
const { cloudinary } = require("../cloudinary")

module.exports.index = async (req, res) => {
   const camps = await Campground.find({}).populate("poster")
   res.render("campgrounds/index", { camps })
}
module.exports.renderCampgroundDetails = async (req, res) => {
   const camp = await Campground.findById(req.params.id)
      .populate({
         path: "reviews",
         populate: { path: "poster" },
      })
      .populate("poster")
   if (!camp) {
      req.flash("error", "Campground not found :(")
      return res.redirect("/campgrounds")
   }
   console.log(camp)
   res.render("campgrounds/details", { camp })
}
module.exports.renderEditCampground = async (req, res) => {
   const camp = await Campground.findById(req.params.id)
   if (!camp) {
      req.flash("error", "Could not find that campground.")
      return req.redirect("/campgrounds")
   }
   res.render("campgrounds/edit", { camp })
}
module.exports.renderNewForm = (req, res) => res.render("campgrounds/new")

module.exports.createCampgrund = async (req, res, next) => {
   const geoData = await geocoder
      .forwardGeocode({
         query: req.body.campground.location,
         limit: 1,
      })
      .send()

   const camp = new Campground(req.body.campground)

   camp.geometry = geoData.body.features.length
      ? geoData.body.features[0].geometry
      : { type: "Point", coordinates: [] }

   camp.poster = req.user._id
   camp.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
      originalFilename: f.originalname,
   }))
   await camp.save()
   console.log(camp)
   req.flash("success", "Successfuly made a new campground!")
   res.redirect(`campgrounds/${camp._id}`)
}
module.exports.editCampground = async (req, res) => {
   const { id } = req.params
   const camp = await Campground.findByIdAndUpdate(id, req.body.campground)
   console.log(req.body)
   const images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
      originalFilename: f.originalname,
   }))
   camp.images.push(...images)
   if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) await cloudinary.uploader.destroy(filename)
      await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
   }
   await camp.save()
   req.flash("success", "Successfuly updated a campground!")
   res.redirect(`/campgrounds/${id}`)
}
module.exports.deleteCampground = async (req, res) => {
   const { id } = req.params
   const { images } = await Campground.findById(id)
   if (images.length) for (let img of images) await cloudinary.uploader.destroy(img.filename)
   const deletedCamp = await Campground.findByIdAndDelete(id)
   console.log("########## CAMPGROUND DELETED ##########", deletedCamp)
   req.flash("success", "Successfuly deleted a campground!")
   res.redirect("/campgrounds")
}
