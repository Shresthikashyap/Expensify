const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
const userauthentication = require('../middleware/auth');

router.post('/signup',userController.addUser);
router.post('/login',userController.getLogin);
router.post('/update-user',userauthentication.authenticate,userController.updateUser);
router.post('/verifyemail',userauthentication.authenticate,userController.verifyUser);

module.exports = router;