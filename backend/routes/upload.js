var express = require('express');
const multer = require('multer')
var path = require('path');

var router = express.Router();

const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage})
router.post('/', upload.single('product'), (req,res) => {
    res.json({
        success:1,
        image_url: `http://localhost:4000/images/${req.file.filename}`
    })
})

module.exports = router;
