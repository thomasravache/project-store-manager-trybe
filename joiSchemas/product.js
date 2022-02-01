const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(5).not().empty()
  .required(),
  quantity: Joi.number().min(1).not().empty()
  .required()
  .messages({
    'number.min': '"quantity" must be a number larger than or equal to 1',
    'number.base': '"quantity" must be a number larger than or equal to 1',
  }),
});

module.exports = schema;
