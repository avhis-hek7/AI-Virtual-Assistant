const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('../middlewares/multer.middleware');

const router = express.Router();

router.get('/currentuser', authMiddleware.authMiddleware, userController.getCurrentUserController);

router.post('/update',authMiddleware.authMiddleware, upload.single('assisatntImage'), userController.updateAssistant )

router.post('/asktoassistant', authMiddleware.authMiddleware, userController.askToAssistant)



module.exports = router;
