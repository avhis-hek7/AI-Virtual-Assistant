const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/currentuser', userController.getCurrentUserController);



module.exports = router;
