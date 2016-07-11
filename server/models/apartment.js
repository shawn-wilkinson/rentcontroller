import mongoose from 'mongoose';
import Renter from './renter';
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  name: { type: String, required: true },
  sqft: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  floor: { type: Number, required: true },
  rent: { type: Number, required: true },
  dateCreated: { type: Date, default: Date.now },
  renter: { type: mongoose.Schema.ObjectId, ref: 'Renter', default: null },
});

apartmentSchema.methods.lease = function lease (renterId, cb) {
  this.renter = renterId;
  this.save(function(err, apartment){
    let query = {"_id": renterId};
    let update = {apartment: apartment._id};
    let options = {new: true};
    Renter.findOneAndUpdate(query, update, options, function(err2, renter) {
      cb(null, { apartment, renter });
    });
  });
};

module.exports = mongoose.model('Apartment', apartmentSchema);
