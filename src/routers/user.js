const express = require('express');
const router = new express.Router();
const User = require('../models/user.js');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
require('dotenv').config();





//create
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send('Error: ' + error);
    }
});

//login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send('Error: ' + error);
    }
});

//logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send('logout');
    } catch (error) {
        res.status(500).send('Error: ' + error);
    }
});

//logoutAll
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('Logout all');
    } catch (error) {
        res.status(500).send('Error: ' + error);
    }
});

//read profile
router.get('/users/me', auth, async (req, res) => {
    try{
    res.send(req.user);
    } catch(error) {
        res.status(500).send(error);
    }
});

//read one
router.get('/users/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found. 404');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send('Error: ' + error);
    }
});

//update
router.patch('/users/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'password', 'email'];
    const isValidator = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidator) {
        return res.status(400).send({ error: 'invalid update!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

//delete
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a jpg, jpeg or png file'));
        }
        cb(undefined, true);
    }
});

//upload image
router.post('/users/me/avatar', auth, upload.single('avatar'), async  (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send('Image uploaded');
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

//delete image
router.delete('/users/me/avatar', auth, async (req, res) => {
    try{
    req.user.avatar = undefined;
    await req.user.save();        
    res.send('Tha avatar has ben deleted');
    } catch(error) {
        res.status(400).send(error);
    }
});

//view image
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar) {
            throw new Error('error');
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch(error) {
        res.send(error);
    }
});


module.exports = router;
