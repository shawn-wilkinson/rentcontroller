/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  name: joi.string().required(),
  sqft: joi.number().min(0).required(),
  bedrooms: joi.number().min(1).max(5).required(),
  floor: joi.number().min(1).max(20).required(),
  rent: joi.number().min(0).required(),
  dateCreated: joi.date(),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;
    next();
  }
};
