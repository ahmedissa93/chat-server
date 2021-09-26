const { Router } = require('express');
const authController = require('../controllers/authControllers');
const router = Router();
router.post('/auth/signup', authController.signup)
router.post('/auth/login', authController.login)
router.get('/logout', authController.logout)
router.get('/auth/verifyuser', authController.verifyuser)
module.exports = router;