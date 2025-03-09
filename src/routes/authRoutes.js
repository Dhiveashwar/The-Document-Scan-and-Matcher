const express = require('express')
// Create router object
var authRouter = express.Router();

const authController = require('../Controllers/Controllerforauthenication');

// Import auth verification middleware 
const verifyToken = require('../middleware/authMiddleware')


authRouter.post('/register', authController.register);

authRouter.post('/login', authController.userlogin);

authRouter.get('/profile', verifyToken, authController.userProfile);

// we have to Make router available for import
module.exports = authRouter;