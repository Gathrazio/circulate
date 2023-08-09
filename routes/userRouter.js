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

module.exports = userRouter;