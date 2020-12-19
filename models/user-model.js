const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userDocRev = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    }
},)

const User = mongoose.model("UserDocRev", userDocRev);
module.exports = User;