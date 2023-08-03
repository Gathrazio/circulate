const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { expressjwt: jwt } = require('express-jwt');
const path = require('path');
require('dotenv').config()

app.use(express.json())
app.use(morgan('dev'))

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('connected to circulatedb'))

app.use(express.static(path.join(__dirname, 'client', 'dist')))
app.use('/api/auth', require('./routes/authRouter.js'))

app.use('/api/protected', jwt({
    secret: process.env.USER_SECRET,
    algorithms: ['HS256']
}))
app.use('/api/protected/chats', require('./routes/chatRouter.js'))
app.use('/api/protected/friends', require('./routes/friendRouter.js'))

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.listen(9000)