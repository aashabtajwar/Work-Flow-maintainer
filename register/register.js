const User = require('../models/user-model.js');
const bcrypt = require('bcrypt');
const express = require('express');
const cons = require('consolidate');
const router = express.Router();



router.get('/', (req, res) => {
    res.render('reg.html')
});
router.post('/', (req, res) => {
    // register the user
    const { name, email, password, position } = req.body;
    // check if user exists
    User.find({email: email})
        .then((result) => {
            // check if user exists;
            if (result.length === 0) {
                // register the user
                registerUser();
            }
            else {
                // if a user already exists
                res.redirect('/register?error=userExists');
            }
        })
        .catch((err) => {
            // when you can implement flash messages here
            res.redirect('/register?error=registrationError');
        })
    async function registerUser() {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            var user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                position: position
            });
            user = await user.save();
            console.log(user);
            res.redirect('/login?success=RegisrationSuccessful!')
        }
        catch(e) {
            res.redirect('/register?error=unknownError');
        }
    }
})

module.exports = router;