const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utilities/wrapAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')
const reviews = require('../controllers/reviews');

router.post('/', validateReview, isLoggedIn, wrapAsync(reviews.postReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;