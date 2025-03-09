const express = require('express');
// Create new router instance
var creditRouter = express.Router();

const checkToken = require('../middleware/authMiddleware');


const credits = require('../Controllers/Controllerforcredit');


creditRouter.post("/request", checkToken, credits.requestCredits);

creditRouter.post("/process", checkToken, credits.processCreditrequests);

creditRouter.get("/balance", checkToken, credits.getallCredits);


creditRouter.post('/reset', checkToken, function(req, res) {
    // we are Calling the  reset function
    credits.resetDailycredits();
    

    res.json({
        message: "rest sucessfully",
        status: "ok"
    });
});


module.exports = creditRouter;