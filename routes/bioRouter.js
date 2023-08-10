const express = require('express');
const bioRouter = express.Router();
const User = require('../models/User.js');
const Biography = require('../models/Biography.js');
const Cryptr = require('cryptr');
const biocryptr = new Cryptr(process.env.BIO_SECRET);


bioRouter.put('/update', (req, res, next) => { // updates bio of current user
    User.findOne({ _id: req.auth._id })
        .then(user => {
            Biography.findOneAndUpdate(
                { _id: user.bioId },
                { body: biocryptr.encrypt(req.body.body)},
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

bioRouter.get('/', (req, res, next) => { // gets bio of current user
    User.findOne({ _id: req.auth._id })
        .then(user => {
            console.log('user.bioId', user.bioId.toString())
            Biography.findOne({ _id: user.bioId.toString() })
                .then(bio => {
                    const decryptedBio = {
                        ...bio._doc,
                        body: biocryptr.decrypt(bio.body)
                    }
                    return res.status(200).send(decryptedBio);
                })
                .catch(err => {
                    res.status(500)
                    return next(new Error("Failed to find bio."));
                })
        })
        .catch(err => {
            res.status(500)
            return next(new Error("Failed to find user."))
        })
})

bioRouter.get('/all', (req, res, next) => { // gets the bios of all users
    Biography.find()
        .then(bios => res.status(200).send(bios))
        .catch(err => {
            res.status(500)
            return next(new Error("Failed to find bios."))
        })
})

module.exports = bioRouter;