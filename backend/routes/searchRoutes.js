const express = require('express');
const router = express.Router();
const { searchMedia } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', searchMedia);

module.exports = router;
