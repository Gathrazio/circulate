const express = require('express');
const friendRouter = express.Router();
const User = require('../models/User.js');
const Chat = require('../models/Chat.js');
const mongoose = require('mongoose');
const axios = require('axios');

friendRouter.route('/')
    .post((req, res, next) => { // makes the user who sent the request and another user specified in req.body friends, and creates a shared chat between them
        const newChat = new Chat({messages: []});
        newChat.save()
            .then(savedChat => {
                console.log("saved the chat", savedChat)
                User.findOneAndUpdate(
                    { _id: req.auth._id },
                    {$push: { friends: {
                        friendId: req.body.friendId,
                        chat: savedChat._id
                    }}},
                    { new: true })
                    .then(updatedUser => {
                        console.log('updated the user', updatedUser)
                        User.findOneAndUpdate(
                            { _id: req.body.friendId },
                            {$push: { friends: {
                                friendId: req.auth._id,
                                chat: savedChat._id
                            }}},
                            { new: true })
                            .then(updatedFriend => res.status(201).send("It is done!"))
                            .catch(err => {
                                res.status(500)
                                return next(new Error("Failed to update the user's friend."))
                            })
                    })
                    .catch(err => {
                        res.status(500)
                        return next(new Error("Failed to update the user."))
                    })
            })
            .catch(err => {
                res.status(500)
                return next(new Error("Failed to save intialized chat."))
            })
    })

module.exports = friendRouter;