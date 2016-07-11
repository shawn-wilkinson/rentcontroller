/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Renter from '../models/renter';
import paramsValidator from '../validators/renters/params.js';
import bodyValidator from '../validators/renters/body.js';
const router = module.exports = express.Router();

// show all
router.get('/', (req, res) => {
  Renter.find().populate('apartments').exec((err, renters) => res.send({ renters }));
});

//
// //index
router.get('/:id', paramsValidator, (req, res) => {
  Renter.findById(req.params.id, (err, renter) => {
    res.send({ renter });
  });
});

//update
router.put('/:id', paramsValidator, bodyValidator, (req, res) => {
  Renter.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, renter) => {
    res.send({ renter });
  });
});

// create
router.post('/', bodyValidator, (req, res) => {
  Renter.create(res.locals, (err, renter) => {
    res.send({ renter });
  });
});

// delete
router.delete('/:id', paramsValidator, (req, res) => {
  Renter.findByIdAndRemove(req.params.id, (err, renter) => {
    if (renter) {
      res.send({ id: renter._id });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});
