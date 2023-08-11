const express = require('express');
const userRouter = express.Router();
const User = require('../models/User.js');

userRouter.route('/')
    .get((req, res, next) => {
        User.findOne({ _id: req.auth._id })
            .then(user => res.status(200).send(user.justFluidInfo()))
            .catch(err => {
                res.status(500)
                return next(new Error("Failed to find user."))
            })
    })

userRouter.route('/all')
    .get((req, res, next) => {
        User.find()
            .then(users => {
                const lightUserInfos = users.map(user => user.justUsername())
                res.status(200).send(lightUserInfos)
            })
            .catch(err => {
                res.status(500)
                return next(new Error("Failed to find users."))
            })
    })

userRouter.route('/friendsearchusers')
    .get((req, res, next) => { // regex search for users that are not the current user's friend
        const { username } = req.query;
        const pattern = new RegExp(username);
        User.find({ username : { $regex: pattern, $options: 'i'}})
            .then(regexFilteredUsers => {
                const friendFilteredUsers = regexFilteredUsers.filter(user => !Boolean(user.friends.find(friend => friend.friendId.toString() === req.auth._id)) && user._id != req.auth._id);
                return res.status(200).send(friendFilteredUsers.map(filteredUser => filteredUser.justUsernameAndProfileAndBioId()));
            })
            .catch(err => {
                res.status(500)
                return next(err)
            })
    })

module.exports = userRouter;