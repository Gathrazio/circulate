const express = require('express');
const authRouter = express.Router();
const User = require('../models/User.js');
const Biography = require('../models/Biography.js');
const Profile = require('../models/Profile.js');
const jwt = require('jsonwebtoken');

authRouter.post('/signup', (req, res, next) => {
    User.findOne({ username: req.body.username.toLowerCase() })
        .then(user => {
            if (user) {
                res.status(403)
                return next(new Error('Username is already taken.'))
            }
            const newUser = new User({
                ...req.body,
                friends: [],
                requests: []
            });
            newUser.save()
                .then(savedUser => {
                    const newBio = new Biography({
                        author: savedUser._id.toString(),
                        body: ''
                    })
                    newBio.save()
                        .then(savedBio => {
                            const newProfile = new Profile({
                                imgUrl: ''
                            });
                            newProfile.save()
                                .then(savedProfile => {
                                    User.findOneAndUpdate(
                                        { _id: savedUser._id.toString() },
                                        {
                                            bioId: savedBio._id.toString(),
                                            profileId: savedProfile._id.toString()
                                        },
                                        { new: true })
                                        .then(updatedUser => {
                                            const token = jwt.sign(updatedUser.justUsername(), process.env.USER_SECRET);
                                            return res.status(201).send({
                                                token,
                                                user: updatedUser.justSignIn()
                                            });
                                        })
                                        .catch(err => {
                                            res.status(500)
                                            return next(err)
                                        })
                                })
                                .catch(err => {
                                    res.status(500)
                                    return next(err)
                                })
                            
                        })
                        .catch(err => {
                            res.status(500)
                            return next(err)
                        })
                })
                .catch(err => {
                    res.status(500)
                    return next(new Error('Failed the newUser .save.'));
                })
        })
        .catch(err => {
            res.status(500)
            return next(new Error('Failed the User .findOne'));
        })
})

authRouter.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username.toLowerCase() })
        .then(user => {
            if (!user) {
                res.status(404)
                return next(new Error("User does not exist."));
            }
            user.checkPassword(req.body.password, (err, isMatch) => {
                if (err) {
                    res.status(500)
                    return next(new Error("Failed to check password."));
                }
                if (!isMatch) {
                    res.status(403)
                    return next(new Error("Password is incorrect."));
                }
                const token = jwt.sign(user.justUsername(), process.env.USER_SECRET);
                res.status(200).send({
                    token,
                    user: user.justSignIn()
                })
            })
        })
        .catch(err => {
            res.status(500)
            return next(err);
        })
})

module.exports = authRouter;