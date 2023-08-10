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

module.exports = userRouter;