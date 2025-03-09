const express = require('express');

var docRouter = express.Router();


const docControl = require('../Controllers/Controllerfordocument');

const checkAuth = require('../middleware/authMiddleware');
const fileUploader = require('../middleware/uploadMiddleware');
const {reduceCredits} = require('../Controllers/Controllerforcredit');

// Upload endpoint - needs auth, credits check, and file handling
docRouter.post(
    '/upload', 
    checkAuth,
    reduceCredits,
    fileUploader.single("document"),
    docControl.uploadDocument
);

// Document matching endpoint
docRouter.get(
    '/match/:docId', 
    checkAuth, 
    docControl.matchDocumentAPI
);

// User history endpoint
docRouter.get(
    '/history', 
    checkAuth, 
    docControl.getUserPastScans
);


module.exports = docRouter;