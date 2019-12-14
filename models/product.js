const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  edibility: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);