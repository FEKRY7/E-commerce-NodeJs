const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './../../uploads');
    },
    filename: function (req, file, cb) {         
        const DS = Math.round(Math.random() * 1E9);
        const KG = file.mimetype.split('/')[1];
        const filename = DS + '.' + KG;
        cb(null, filename);
    }
});

const fileFilter = function (req, file, cb) {
    const filetype = file.mimetype.split('/')[0];
    if (filetype !== 'image') {
        cb(null, false);
    } else {
        cb(null, true);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

const cpUpload = upload.fields(
    [
        { name: 'categoryImage', maxCount: 1 },
        { name: 'gallery', maxCount: 4 },
        { name: 'banners', maxCount: 2 },
        { name: 'products', maxCount: 2 },
    ]
)

module.exports = cpUpload;