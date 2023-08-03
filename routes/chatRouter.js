const express = require('express');
const chatRouter = express.Router();
const Chat = require('../models/Chat.js');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.MESSAGE_SECRET);

module.exports = chatRouter;