var express = require('express');
var router = express.Router();
var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/submissions', db.getSubmissions);
router.get('/api/submissions/:id', db.getSingleSubmission);
router.get('/api/artwork/new/:days_ago', db.getNewArtwork);
router.get('/api/artwork/top', db.getTopArtwork);
router.get('/api/artwork/top/rating/:days_ago', db.getTopArtworkByRating);
router.get('/api/artists/top', db.getTopArtists);

module.exports = router;
