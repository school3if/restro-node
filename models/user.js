const { Schema, model } = require('mongoose');

const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = model('User', schema);