const express = require('express');
const app = express();

const validate = require('express-validation');
const rateLimit = require("express-rate-limit");

const cors = require('cors');
const bodyParser = require('body-parser')
const authMiddleware = require('./middleware/authMiddleware');
const errorHandlingMiddleware = require('./middleware/errorHandlingMiddleware');
const accessMiddleware = require('./middleware/accessMiddleware');

const AD_PATH = '/ad'
const AD_INSIGHTS_PATH = '/ad-insights'

app.enable("trust proxy");

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: {
    'error': 'Too Many Requests. Please try again in 1 minute.'
  }
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(authMiddleware);
app.use(apiLimiter);

const AdInsightsController = require('./adInsightsController');
app.use(AD_INSIGHTS_PATH, accessMiddleware(AD_INSIGHTS_PATH), AdInsightsController);

const AdController = require('./adController');
app.use(AD_PATH, accessMiddleware(AD_PATH), AdController);

app.use(errorHandlingMiddleware);

module.exports = app;
