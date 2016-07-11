/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Apartment from '../models/apartment';
import paramsValidator from '../validators/apartments/params.js';
import bodyValidator from '../validators/apartments/body.js';
const router = module.exports = express.Router();

// show all
router.get('/', (req, res) => {
  Apartment.find().populate('renters').exec((err, apartments) => res.send({ apartments }));
});

//index
router.get('/:id', paramsValidator, (req, res) => {
  Apartment.findById(req.params.id, (err, apartment) => {
    res.send({ apartment });
  });
});

// update
router.put('/:id', paramsValidator, bodyValidator, (req, res) => {
  Apartment.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, apartment) => {
    res.send({ apartment });
  });
});

// create
router.post('/', bodyValidator, (req, res) => {
  Apartment.create(res.locals, (err, apartment) => {
    res.send({ apartment });
  });
});

// delete
router.delete('/:id', paramsValidator, (req, res) => {
  Apartment.findByIdAndRemove(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ id: apartment._id });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

//lease
router.put('/:id/lease', (req, res) => {
  Apartment.findById(req.params.id, (err, apartment) => {
    apartment.lease(req.body.renterId, (err, leasedApartment) => {
       res.send({ leasedApartment });
     });
  });
});
