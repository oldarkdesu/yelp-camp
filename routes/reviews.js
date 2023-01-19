const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync');
const { validateReview, ensureLogin } = require('../middleware')
const reviews = require('../controllers/reviews')

router.post("/", ensureLogin, validateReview, wrapAsync(reviews.createReview))
router.delete('/:reviewId', wrapAsync(reviews.deleteReview))

module.exports = router
