const express = require('express');
const router = express.Router();
const { register, login, me, changePassword } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin, validateChangePassword } = require('../middlewares/validation.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/register', upload.single('profile_picture'), validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', verifyToken, me);
router.put('/change-password', verifyToken, validateChangePassword, changePassword);

module.exports = router;