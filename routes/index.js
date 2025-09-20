const express = require('express');
const router = express.Router();
const idx = require('../controllers/indexController');
router.get('/', idx.home);
module.exports = router;