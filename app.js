require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const cons = require('consolidate');
const registerRouter = require('./register/register.js');
const cookieParser = require('cookie-parser');
const loginRouter = require('./login/login.js')
const express = require('express');
const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('Connected to DB');
        app.listen(process.env.PORT || 3000);
    })
    .catch((err) => console.log(err));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');
app.use('/register', registerRouter);
app.use('/login', loginRouter);

app.get('/dashboard', authCheck,(req, res) => {
    res.send('HI!')
})

// middleware functions
function authCheck(req, res, next) {
    var { token } = req.cookies;
    if (token === undefined) {
        res.sendStatus(403);
    }
    else {
        jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
            if (err) return res.sendStatus(401);
            else {
                req.user = user;
                next();
            }
        })
    }
}
function loginCheck(req, res, next) {
    if (!req.user) {
        next();
    }
    else {
        // send them to the current url and send a flash message
        redirect('/dashboard');
    }
}