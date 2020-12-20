const User = require('../models/user-model.js');
const Work = require('../models/work-model.js');
const multer = require('multer');
const express = require('express');
const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

router.get('/:workId', (req, res) => {
    Work.findOne({_id: req.params.workId})
        .then((result) => res.render('render.ejs', {result: result}))
});
router.post('/:workId', upload.single('avatar'),(req, res) => {
    const content = req.file.buffer.toString();
    Work.findOne({_id: req.params.workId})
        .then((result) => {
            result.content = content;
        })
        .catch(err => console.log(err))
})


router.get('/', (req, res) => {
    // for the juniors
    Work.find({person: req.user.name})
        .then((result) => {
            res.render('load2.ejs', {results:result})
        })
        .catch(err => console.log(err))
})

router.get('/select/:user', seniorCheck, (req, res) => {
    res.render('form.ejs', { theID: req.params.user });

});
router.post('/select/:user', seniorCheck, (req, res) => {
    const { title, description } = req.body;
    User.findOne({_id: req.params.user})
        .then((user) => {
            // save data
            saveData(user)
        })
        .catch((err) => console.log(err))
    async function saveData(user) {
        var work = new Work({
            person: user.name,
            title: title,
            description: description
        })
        work = await work.save();
        res.send(`Work has been set for ${user.name}`);
    }
})


router.get('/select', seniorCheck, (req, res) => {
    // select a junior user
    User.find({position: 'Junior'})
        .then((result) => {
            res.render('load.ejs', { results: result})
        })
        .catch((err) => {
            res.sendStatus(501);
        })
});

// check submitted works
router.get('/submits', (req, res) => {
    Work.find({content: !null})
        .then(result => res.send(result))
})

function seniorCheck(req, res, next) {
    if (req.user.pos === 'Senior') {
        next();
    }
    else {
        res.send(401);
    }
}

module.exports = router;