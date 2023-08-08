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

mongoose.Schema.Types.String.checkRequired(v => v != null)

module.exports = mongoose.model("Biography", biographySchema);