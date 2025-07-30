const express = require('express');
const router = express.Router();
const geminiController = require('../../controllers/geminiController/geminiController');

router.post('/generate-post', geminiController.generateContent);

module.exports = router;