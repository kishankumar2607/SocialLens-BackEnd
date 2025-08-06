
const multer = require('multer');
const memoryStorage = multer.memoryStorage();

module.exports = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});