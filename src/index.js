const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up in port ' + port);
});





const multer = require('multer');
const upload = multer({
    dest: 'imagen',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a jpg, jpeg or png file'));
        }
        cb(undefined, true);
    }
});


app.post('/upload',upload.single('upload'), (req, res) => {
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

