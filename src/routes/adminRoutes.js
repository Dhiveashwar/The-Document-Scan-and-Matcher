const express = require("express");
const router = express.Router();

// Get the admin controller functions
const adminStuff = require("../Controllers/Controllerforadmin");

const checkAuth = require("../middleware/authMiddleware");

// Set up admin analytics route - needs authentication
router.get("/analytics", checkAuth, adminStuff.getAdminAnalytics);

module.exports = router;