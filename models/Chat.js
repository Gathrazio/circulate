const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ["Sent", "Read"],
        default: "Sent"
    }
});

const chatSchema = new Schema({
    messages: {
        type: [messageSchema],
        required: true
    }
});

module.exports = mongoose.model("Chat", chatSchema);