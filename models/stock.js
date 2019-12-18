const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');

const stockSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId, ref: 'Product',
    required: true
   },
  pulldate: {
    type: Date,
    required: true
   },
   pullquantity: {
     type: Number,
     require: true
   },
   quantity: {
     type: Number,
   },
   price: {
    type: Number,
    required: true
   }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', stockSchema);