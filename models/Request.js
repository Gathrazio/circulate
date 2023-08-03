const mongoose = require('mongoose');
const Schema = mongoose.Schema;

requestSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);