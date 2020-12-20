const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const workSchema = new Schema({
    person: {
        type: String,
        required: true
    },
    content: {  // should it be buffer instead?
        type: String,
        default: null
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    approved: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });
const Work = mongoose.model('Work', workSchema);
module.exports = Work;