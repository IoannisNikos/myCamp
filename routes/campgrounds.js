const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(campgrounds.homePage))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.submitNewCamp));

router.get('/new', isLoggedIn, campgrounds.newCampForm);

router.route('/:id')
    .get(wrapAsync(campgrounds.campDetailsPage))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.submitEdits))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

module.exports = router;