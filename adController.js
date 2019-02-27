const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const validation = require('./validation/adValidation');
const Ad = require('./ad');

router.get('/:id', validate(validation.getAdInsights), (req, res, next) => {
  const adId = req.params.id;

  Ad.getAd(adId).then(result => {
    res.json(result);
  }).catch(next);
})

module.exports = router;
