var Joi = require('joi');

module.exports = {
  getAdInsights: {
    params: {
      id: Joi.string().required(),
    }
  },
};
