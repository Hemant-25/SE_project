const express = require('express');
const userController = require('./user.controller.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const router = express.Router();

const DIR = path.join(__dirname, '../uploads/');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        // eslint-disable-next-line max-len
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

router.post('/login', async (req, res) => {
    try {
        const login = req.body;
        const result = await (userController.login(login));
        res.status(200).send(result);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const userData = req.body;
        const result = await userController.signup(userData);
        res.status(200).send(result);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
});

// eslint-disable-next-line max-len
router.post('/upload', upload.array('uploads[]', 12), (req, res) => {
    console.log(req.files);
    userController.upload(req, res);
});

router.get('/getAllFiles', (req, res) => {
    objArray = [];
    fs.readdirSync(DIR).forEach((file) => {
        objArray.push({
            name: file,
            type: mime.getType(file),
        });
     
    });
  
    res.send(objArray);
 
});

module.exports = router;
