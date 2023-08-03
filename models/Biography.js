const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const biographySchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        required: true
    }
})