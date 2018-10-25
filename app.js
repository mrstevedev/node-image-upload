
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Init app 
const app = express();

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
        callback(null, req.body.name + 
        path.extname(file.originalname))
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000,     
    },
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    }
}).single('upload');

checkFileType = (file, callback) => {
    // Allowed ext 
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime-type 
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname) {
        return callback(null, true)
    } else {
        callback("Error: Images only");
    }
}

// EJS 
app.set('view engine', 'ejs');

// Public folder
app.use(express.static('./public'));

// Render Index View
app.get('/', (req, res) => {
    res.render('index')
});

// Render Profile VIew
app.get('/profile', (req, res) => {
    res.render('profile');
});

// Index Route 
app.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('index', {
                msg: err
            });
        } else {
            if(req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No File Selected'
                });
            } else {
                res.render('index', {
                    msg: 'File Uploaded',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));


