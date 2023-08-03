const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const saltRounds = 10;

const friendSchema = new Schema({
    friendId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    chat: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, { _id: false })

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    friends: {
        type: [friendSchema],
        required: true
    }
});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next()
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next()
    })
})

userSchema.methods.checkPassword = function (passwordAttempt, callback) {
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
        if (err) return callback(err);
        return callback(null, isMatch);
    })
}

userSchema.methods.withoutPassword = function () {
    const user = this.toObject();
    delete user.password
    return user;
}

userSchema.methods.withoutPasswordOrFriends = function () {
    const user = this.toObject();
    delete user.password
    delete user.friends
    return user;
}

module.exports = mongoose.model("User", userSchema);