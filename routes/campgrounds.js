const express = require("express")
const wrapAsync = require('../utils/wrapAsync');
const campgrounds = require('../controllers/campgrounds')
const router = express.Router()
const { ensureLogin, validateCampground, verifyPoster } = require('../middleware');
const { storage } = require("../cloudinary")
const multer = require('multer')
const upload = multer({ storage })

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(ensureLogin, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampgrund))

router.get('/new', ensureLogin, campgrounds.renderNewForm)
router.get('/:id/edit', ensureLogin, verifyPoster, wrapAsync(campgrounds.renderEditCampground))

router.route('/:id')
    .get(wrapAsync(campgrounds.renderCampgroundDetails))
    .patch(ensureLogin, verifyPoster, upload.array('image'), validateCampground, wrapAsync(campgrounds.editCampground))
    .delete(ensureLogin, verifyPoster, wrapAsync(campgrounds.deleteCampground))

module.exports = router
