const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('./category');
const Kitchen = require('./kitchen');

const menuSchema = new Schema({
  date: {
    type: Date,
    required: true
   },
  menu: { type: [String] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Menu', menuSchema);