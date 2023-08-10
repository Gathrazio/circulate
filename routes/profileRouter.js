const express = require('express');
const profileRouter = express.Router();
const User = require('../models/User.js');
const Profile = require('../models/Profile.js');

profileRouter.route('/')
    .get((req, res, next) => { // gets the profile pic of the user who sent the request
        User.findOne({ _id: req.auth._id })
            .then(user => {
                Profile.findOne({ _id: user.profileId })
                    .then(profile => res.status(200).send(profile))
                    .catch(err => {
                        res.status(500)
                        return next(new Error("Failed to find profile."));
                    })
            })
            .catch(err => {
                res.status(500)
                return next(new Error("Failed to find user."));
            })
    })

profileRouter.route('/update')
    .put((req, res, next) => { // updates the user's profile pic with whatever is provided in the request body
        User.findOne({ _id: req.auth._id })
            .then(user => {
                Profile.findOneAndUpdate(
                    { _id: user.profileId },
                    req.body,
                    { new: true })
                    .then(updatedProfile => res.status(201).send("Profile successfully updated."))
                    .catch(err => {
                        res.status(500)
                        return next(new Error("Failed to update profile."));
                    })
            })
            .catch(err => {
                res.status(500)
                return next(new Error("Failed to find user."));
            })
    })

profileRouter.route('/all')
    .get((req, res, next) => { // gets all profile pics
        Profile.find()
            .then(profiles => res.status(200).send(profiles))
            .catch(err => {
                res.status(500)
                return next(new Error("Failed to find profiles."));
            })
    })




module.exports = profileRouter;