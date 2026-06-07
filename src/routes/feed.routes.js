const express = require('express');
const router = express.Router();
const { getComments, createComment } = require('../controllers/feed.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validateComment } = require('../middlewares/validation.middleware');

router.get('/feed', verifyToken, getComments);
router.post('/feed', verifyToken, validateComment, createComment);

module.exports = router;