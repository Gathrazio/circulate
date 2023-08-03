const express = require('express');
const chatRouter = express.Router();
const Chat = require('../models/Chat.js');
const User = require('../models/User.js');
const mongoose = require('mongoose');


chatRouter.route('/')
    .get((req, res, next) => { // gets all chats the user who sent the request is a part of
        User.findOne({ _id: req.auth._id })
            .then(user => {
                const chatIds = user.friends.map(friend => friend.chat);
                Chat.find({ _id: { $in: chatIds}})
                    .then(chats => res.status(200).send(chats))
                    .catch(err => {
                        res.status(500)
                        return next(new Error("Failed to call find."))
                    })
            })
        
    })

chatRouter.route('/find/:chatID')
    .get((req, res, next) => { // gets a chat by id, but only if the chat requested is one the user is part of
        User.findOne({ _id: req.auth._id })
            .then(user => {
                if (!user.friends.find(friend => friend.chat.toString() === req.params.chatID)) {
                    res.status(403)
                    return next(new Error("You do not have permission to add a message to this chat."))
                }
                Chat.findOne({ _id: req.params.chatID })
                .then(chat => {
                    if (!chat) {
                        res.status(404)
                        return next(new Error("Chat does not exist."));
                    }
                    return res.status(200).send(chat);
                })
                .catch(err => {
                    res.status(500)
                    return next(new Error("Failed to call findOne method."))
                })
            })
            
    })

chatRouter.route('/addmessage/:chatID')
    .put((req, res, next) => { // adds a message to a chat by the chat's ID, but only if the chat is one the user is part of
        User.findOne({ _id: req.auth._id })
            .then(user => {
                if (!user.friends.find(friend => friend.chat.toString() === req.params.chatID)) {
                    res.status(403)
                    return next(new Error("You do not have permission to add a message to this chat."))
                }
                Chat.findOneAndUpdate(
                    { _id: req.params.chatID },
                    {$push: {messages: {
                        body: req.body.body,
                        author: req.auth._id
                    }}},
                    { new: true })
                    .then(updatedChat => res.status(201).send("Chat updated!"))
                    .catch(err => {
                        res.status(500)
                        return next(new Error("Failed to call findOneAndUpdate."))
                    })
            })
        
    })

module.exports = chatRouter;