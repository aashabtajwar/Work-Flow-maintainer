require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user-model.js');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login.html');
})
router.post('/', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                res.redirect('/login?error=noSuchUser');
            }
            else {
                loginUser(user);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    async function loginUser(user) {
        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log('Time to log in!')
                authorizeUser(user);
            }
            else {
                console.log('IT COMES HERE!')
                res.redirect('/login?error=passwordMismatch');
            }
        }
        catch(e) {
            console.log('Problem')
            res.redirect('/login?error=loginError');
        }
    }
    function authorizeUser(user) {
        const userSave = {
            name: user.name,
            pos: user.position,
            email: user.email,
            iD: user._id
        };
        //console.log(userSave);
        const token = jwt.sign(userSave, process.env.SECRET_TOKEN, { expiresIn: '30s' });
        res.cookie('token', token, { maxAge: 30*1000, httpOnly: true });
        res.redirect('/dashboard');
    }
})

module.exports = router;