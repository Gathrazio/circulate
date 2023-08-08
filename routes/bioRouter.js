const express = require('express');
const bioRouter = express.Router();
const User = require('../models/User.js');
const Biography = require('../models/Biography.js');

bioRouter.put('/update', (req, res, next) => {
    User.findOne({ _id: req.auth._id })
        .then(user => {
            Biography.findOneAndUpdate(
                { _id: user.bioId },
                req.body,
                { new: true })
                .then(updatedBio => res.status(201).send(updatedBio))
                .catch(err => {
                    res.status(500)
                    return next(new Error("Failed to update bio."))
                })
        })
        .catch(err => {
            res.status(500)
            return next(new Error("Failed to find the user."))
        })
})

module.exports = bioRouter;