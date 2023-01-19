const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');

const ensureLogin = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be logged in');
    res.redirect('/login');
}
const validateCampground = (req, res, next) =>{
    const { error } = campgroundSchema.validate(req.body)
    if (!error)
        return next()
    const msg = error.details.map(element => element.message).join(', ')
    throw new ExpressError(400, msg)
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (!error)
        return next()
    const msg = error.details.map(element => element.message).join(',')
    throw new ExpressError(400, msg)
}
const verifyPoster = async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id);
    if (camp.poster.equals(req.user._id))
        return next()
    req.flash('error', "You don't have permission to do that")
    res.redirect(`/campgrounds/${id}`)
}
const verifyReviewPoster = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (review && review.poster.equals(req.user._id))
        return next() 
    req.flash('error', "You don't have permission to do that")
    res.redirect(`/campgrounds/${id}`)
}

module.exports = { ensureLogin, 
                   validateCampground, 
                   validateReview, 
                   verifyPoster, 
                   verifyReviewPoster }