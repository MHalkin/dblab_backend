const multer = require('multer');
const path = require('path');
const fs = require('fs');

const tempDir = path.join(__dirname, '../uploads-temp');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const safeName = path.basename(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(safeName));
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    const allowedBinaryExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const allowedBinaryMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedTextExtensions = ['.txt', '.sql', '.json'];

    if (allowedBinaryExtensions.includes(ext)) {
        if (allowedBinaryMimes.includes(mime)) {
            return cb(null, true);
        } else {
            return cb(new Error(`Security Alert: Mismatched MIME type (${mime}) for image extension (${ext}).`), false);
        }
    }

    if (allowedTextExtensions.includes(ext)) {
        return cb(null, true);
    }

    return cb(new Error(`Error: Invalid file type. Extension ${ext} is not permitted.`), false);
};

const uploadMaterial = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = uploadMaterial;