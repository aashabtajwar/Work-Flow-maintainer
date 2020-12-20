require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const cons = require('consolidate');
const registerRouter = require('./register/register.js');
const workRouter = require('./work/work.js');
const cookieParser = require('cookie-parser');
const loginRouter = require('./login/login.js');
const methodOverride = require('method-override');
const express = require('express');
const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('Connected to DB');
        app.listen(process.env.PORT || 3000);
    })
    .catch((err) => console.log(err));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }))
app.set('view-engine', 'ejs');
app.use('/register', loginCheck, registerRouter);
app.use('/login', loginCheck, loginRouter);
app.use('/work', authCheck, verifyToken, workRouter);

app.get('/profile', authCheck, verifyToken, (req, res) => {
    res.json(req.user);
})

app.get('/dashboard', authCheck, verifyToken, (req, res) => {
    res.render('dash.ejs', { user:req.user })
});

// logout user
app.delete('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login?success=logoutSuccess')
})


// middleware functions
// it is best to separate cookie checking and jwt verifying middlewares
function authCheck(req, res, next) {
    const { token } = req.cookies;
    if (token === undefined) {
        res.sendStatus(403);
    }
    else {
        next();
    }
}

function verifyToken(req, res, next) {
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if (err) return res.sendStatus(401);
        else {
            req.user = user;
            next();
        }
    })
}

function loginCheck(req, res, next) {
    if (req.cookies.token === undefined) {
        next();
    }
    else {
        // send them to the current url and send a flash message
        res.redirect('/dashboard');
    }
}