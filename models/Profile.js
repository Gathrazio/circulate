const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    imgUrl: {
        type: String,
        required: true
    }
})

mongoose.Schema.Types.String.checkRequired(v => v != null)

module.exports = mongoose.model("Profile", profileSchema);