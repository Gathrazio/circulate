const express = require('express');
const friendRouter = express.Router();
const User = require('../models/User.js');
const Chat = require('../models/Chat.js');
const mongoose = require('mongoose');
const axios = require('axios');
const { TokenExpiredError } = require('jsonwebtoken');

friendRouter.route('/add')
    .post((req, res, next) => { // makes the user who sent the request and another user specified in req.body friends, and creates a shared chat between them
        const newChat = new Chat({messages: []});
        newChat.save()
            .then(savedChat => {
                User.findOneAndUpdate(
                    { _id: req.auth._id },
                    {$push: { friends: {
                        friendId: req.body.friendId,
                        chat: savedChat._id
                    }}},
                    { new: true })
                    .then(updatedUser => {
                        User.findOneAndUpdate(
                            { _id: req.body.friendId },
                            {$push: { friends: {
                                friendId: req.auth._id,
                                chat: savedChat._id
                            }}},
                            { new: true })
                            .then(updatedFriend => res.status(201).send("You and the other user are now friends!"))
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

friendRouter.route('/delete')
    .delete((req, res, next) => {
        User.findOne({ _id: req.auth._id })
            .then(user => {
                if (user.friends.find(friend => friend.friendId.toString() === req.body.friendId)) {
                    User.findOneAndUpdate(
                        { _id: req.auth._id },
                        { $pull: {friends: {
                            friendId: req.body.friendId,
                            chat: req.body.chat
                        }}},
                        { new: true })
                        .then(updatedUser => {
                            User.findOneAndUpdate(
                                { _id: req.body.friendId },
                                { $pull: {friends: {
                                    friendId: req.auth._id,
                                    chat: req.body.chat
                                }}},
                                { new: true })
                                .then(updatedFriend => {
                                    Chat.findOneAndDelete({ _id: req.body.chat })
                                        .then(deletedChat => res.status(201).send("Successfully deleted the friendhip."))
                                        .catch(err => {
                                            res.status(500)
                                            return next(new Error("Failed to delete the associated chat."))
                                        })
                                })
                                .catch(err => {
                                    res.status(500)
                                    return next(new Error("Failed to update friend."))
                                })
                        })
                        .catch(err => {
                            res.status(500)
                            return next(err);
                        })
                } else {
                    res.status(403)
                    return next(new Error("You do not have permission to unfriend."))
                }
            })
            .catch(err => {
                res.status(500)
                return next(new Error("Failed to find user."))
            })
    })

friendRouter.route('/request')
    .post((req, res, next) => {
        User.findOneAndUpdate(
            { _id: req.auth._id },
            {$push: {requests: {
                sender: req.auth._id,
                receiver: req.body.userId
            }}})
            .then(updatedUser => {
                User.findOneAndUpdate(
                    { _id: req.body.userId },
                    {$push: {requests: {
                        sender: req.auth._id,
                        receiver: req.body.userId
                    }}})
                    .then(updatedUser => {
                        res.status(201).send("Request sent!")
                    })
                    .catch(err => {
                        res.status(500)
                        return next(new Error("Failed to update request recipient."))
                    })
            })
            .catch(err => {
                res.status(500)
                return next(new Error("Failed to update request sender."))
            })
    })
    .delete((req, res, next) => {
        if (req.auth._id === req.body.receiver || req.auth._id === req.body.sender) {
            User.updateMany(
                { _id: { $in: [req.body.receiver, req.body.sender]} },
                { $pull: {requests: {
                    receiver: req.body.receiver,
                    sender: req.body.sender
                }}},
                { new: true })
                .then(updatedUsers => res.status(200).send("Successfully deleted the request."))
                .catch(err => {
                    res.status(500)
                    return next(new Error("Failed to delete request"));
                })
        } else {
            res.status(403)
            return next(new Error("You do not have permission to delete this friend request."))
        }
    })

module.exports = friendRouter;