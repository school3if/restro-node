const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  order: {
    type: [{
      dish: {
        type: Schema.Types.ObjectId, ref: 'Dish',
        required: true
      },
      quantity: Number
    }],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deliveryTime: {
    type: Date,
    required: true
  },
  deliveryAdress: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('Order', orderSchema);