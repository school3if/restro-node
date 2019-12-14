const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
  title: {
    type: String,
    required: true
   },
  thumb: { type: String },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId, ref: 'Category',
    required: true
   },
  kitchen: {
    type: Schema.Types.ObjectId, ref: 'Kitchen',
    required: true
   },
  cook_time: {
    type: Number,
    required: true
  },
  recipe: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId, ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    required: true
  }
},
  { timestamps: true }
);

module.exports = mongoose.model('Dish', dishSchema);