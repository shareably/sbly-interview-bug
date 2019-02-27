const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const validation = require('./validation/adInsightsValidation');
const AdInsights = require('./adInsights');

router.get('/', validate(validation.getAdInsights), (req, res, next) => {
  const date = req.query.date;
  const metrics = req.query.metrics.split(',');

  AdInsights.getAdInsights(date, metrics).then(result => {
    res.json(result);
  }).catch(next);
})

module.exports = router;
