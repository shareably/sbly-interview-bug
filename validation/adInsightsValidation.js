var Joi = require('joi');

const DateValidator = Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const CommaSeparatedStringValidator = Joi.string().regex(/[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*/);

module.exports = {
  getAdInsights: {
    query: Joi.object().keys({
      date: DateValidator.required(),
      metrics: CommaSeparatedStringValidator.required()
    }).required()
  },
};
