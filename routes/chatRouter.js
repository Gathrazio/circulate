const express = require('express');
const chatRouter = express.Router();
const Chat = require('../models/Chat.js');
const User = require('../models/User.js');
const mongoose = require('mongoose');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.MESSAGE_SECRET)


chatRouter.route('/')
    .get((req, res, next) => { // gets all chats the user who sent the request is a part of
        User.findOne({ _id: req.auth._id })
            .then(user => {
                const chatIds = user.friends.map(friend => friend.chat);
                Chat.find({ _id: { $in: chatIds}})
                    .then(chats => {
                        const decryptedChats = chats.map(chat => {
                            const decryptedMessages = chat.messages.map(message => ({
                                ...message._doc,
                                body: cryptr.decrypt(message.body)
                            }))
                            return {
                                ...chat._doc,
                                messages: decryptedMessages};
                        })
                        return res.status(200).send(decryptedChats);
                    })
                    .catch(err => {
                        res.status(500)
                        return next(new Error("Failed to call find."))
                    })
            })
    })

chatRouter.route('/find/:chatID')
    .get((req, res, next) => { // gets a chat by id, but only if the chat requested is one the user is a part of
        User.findOne({ _id: req.auth._id })
            .then(user => {
                if (!user.friends.find(friend => friend.chat.toString() === req.params.chatID)) {
                    res.status(403)
                    return next(new Error("You do not have permission to view this chat."))
                }
                Chat.findOne({ _id: req.params.chatID })
                    .then(chat => {
                        if (!chat) {
                            res.status(404)
                            return next(new Error("Chat does not exist."));
                        }
                        const decryptedChat = {
                            ...chat._doc,
                            messages: chat.messages.map(message => ({
                                ...message._doc,
                                body: cryptr.decrypt(message.body)
                            }))
                        }
                        return res.status(200).send(decryptedChat);
                    })
                    .catch(err => {
                        res.status(500)
                        return next(new Error("Failed to call findOne method."))
                    })
            })    
    })

chatRouter.route('/addmessage/:chatID')
    .put((req, res, next) => { // encrypts and adds a message to a chat by the chat's ID, but only if the chat is one the user is a part of
        User.findOne({ _id: req.auth._id })
            .then(user => {
                if (!user.friends.find(friend => friend.chat.toString() === req.params.chatID)) {
                    res.status(403)
                    return next(new Error("You do not have permission to add a message to this chat."))
                }
                Chat.findOneAndUpdate(
                    { _id: req.params.chatID },
                    {$push: {messages: {
                        body: cryptr.encrypt(req.body.body),
                        author: req.auth._id
                    }}},
                    { new: true })
                    .then(updatedChat => res.status(201).send({
                        ...updatedChat.messages[updatedChat.messages.length - 1]._doc,
                        body: cryptr.decrypt(updatedChat.messages[updatedChat.messages.length - 1].body)
                    }))
                    .catch(err => {
                        res.status(500)
                        return next(new Error("Failed to call findOneAndUpdate."))
                    })
            })
    })

chatRouter.route('/editmessage/:chatID/:messageID') // updates a specific message of a specific chat, if the user has permission to do so.
    .put((req, res, next) => {
        User.findOne({ _id: req.auth._id })
            .then(user => {
                if (!user.friends.find(friend => friend.chat.toString() === req.params.chatID)) {
                    res.status(403)
                    return next(new Error("You do not have permission to edit a message in this chat."))
                }
                Chat.findOne({ _id: req.params.chatID })
                    .then(chat => {
                        const messageIndex = chat.messages.findIndex(message => message._id.toString() === req.params.messageID);
                        const updatedMessages = chat.messages.toSpliced(messageIndex, 1, {
                            _id: req.params.messageID,
                            author: req.auth._id,
                            body: cryptr.encrypt(req.body.body)
                        })
                        Chat.findOneAndUpdate(
                            { _id: req.params.chatID },
                            { messages: updatedMessages },
                            { new: true })
                            .then(updatedChat => res.status(201).send("Chat updated."))
                    })
            })
    })

chatRouter.route('/updatetoread/:chatID')
    .put((req, res, next) => {
        User.findOne({ _id: req.auth._id })
            .then(user => {
                if (!user.friends.find(friend => friend.chat.toString() === req.params.chatID)) {
                    res.status(403)
                    return next(new Error("You do not have permission to edit messages in this chat."))
                }
                Chat.findOne({ _id: req.params.chatID })
                    .then(chat => {
                        const stampedMessages = chat.messages.map(message => message.author != req.auth._id ? {...message._doc, status: "Read"} : message)
                        Chat.findOneAndUpdate(
                            { _id: req.params.chatID },
                            { messages: stampedMessages},
                            { new: true})
                            .then(updatedChat => res.status(201).send(updatedChat.messages.map(message => ({...message._doc, body: cryptr.decrypt(message.body)}))))
                            .catch(err => {
                                res.status(500)
                                return next(err);
                            })
                    })
                    .catch(err => {
                        res.status(500)
                        return next(err);
                    })
            })
    })

chatRouter.route('/deletemessage/:chatID/:messageID') // deletes a specific message of a specific chat, if the user has permission to do so.
.delete((req, res, next) => {
    User.findOne({ _id: req.auth._id })
        .then(user => {
            if (!user.friends.find(friend => friend.chat.toString() === req.params.chatID)) {
                res.status(403)
                return next(new Error("You do not have permission to add edit a message in this chat."))
            }
            Chat.findOne({ _id: req.params.chatID })
                .then(chat => {
                    const messageIndex = chat.messages.findIndex(message => message._id.toString() === req.params.messageID);
                    const updatedMessages = chat.messages.toSpliced(messageIndex, 1)
                    Chat.findOneAndUpdate(
                        { _id: req.params.chatID },
                        { messages: updatedMessages },
                        { new: true })
                        .then(updatedChat => res.status(201).send("Chat updated; message deleted."))
                })
        })
})

module.exports = chatRouter;