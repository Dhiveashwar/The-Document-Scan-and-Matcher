const express = require('express');
const database = require('../Config/db');
const { userlogin } = require('./Controllerforauthenication');


function deductUserCredit(req, res, next) {
    
    if (req.skipCreditCheck) {
        return next();
    }
    
    let userId = req.user.id;
    
    // First we need to check if user has credits
    database.get("SELECT credits FROM users WHERE id = ?", [userId], function(err, user) {
        if (err) {
            console.log("Database error when checking credits:", err);
            return res.status(500).json({ message: "Server error occurred" });
        }
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Stop if the user has no credits
        if (user.credits <= 0) {
            return res.status(403).json({ message: "Insufficient credits" });
        }
        

        database.run("UPDATE users SET credits = credits - 1 WHERE id = ?", [userId], function(updateErr) {
            if (updateErr) {
                console.log("Failed to update user credits:", updateErr);
                return res.status(500).json({ message: "Failed to process your request" });
            }
            
            console.log(`Credit deducted from user ${userId}. Remaining: ${user.credits - 1}`);
        
            req.creditProcessed = true;
            next();
        });
    });
}

function submitCreditRequest(req, res) {
 
    req.skipCreditCheck = true;
    
    let userId = req.user.id;
    let requestAmount = req.body.amount;
    
    if (!requestAmount || requestAmount <= 0) {
        return res.status(400).json({ message: "Invalid credit amount" });
    }
    
    database.run(
        "INSERT INTO credit_requests (user_id, amount, status) VALUES(?, ?, 'pending')", 
        [userId, requestAmount],
        function(err) {
            if (err) {
                console.log("Error saving credit request:", err);
                return res.status(500).json({ message: "Failed to submit request" });
            }
            
            res.status(201).json({ 
                requestId: this.lastID, 
                message: "Credit request submitted successfully" 
            });
        }
    );
}


function handleCreditRequest(req, res) {
    
    req.skipCreditCheck = true;
    
    let requestId = req.body.requestId;
    let status = req.body.status;
    
    if (status !== "approved" && status !== "denied") {
        return res.status(400).json({ message: "Status must be 'approved' or 'denied'" });
    }
    
    database.get("SELECT * FROM credit_requests WHERE id = ?", [requestId], function(err, request) {
        if (err) {
            console.log("Database error:", err);
            return res.status(500).json({ message: "Error fetching request" });
        }
        
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        
        if (status === "approved") {
            database.run(
                "UPDATE users SET credits = credits + ? WHERE id = ?",
                [request.amount, request.user_id],
                function(updateErr) {
                    if (updateErr) {
                        console.log("Error adding credits:", updateErr);
                        return res.status(500).json({ message: "Failed to add credits" });
                    }
                    
                    database.run(
                        "UPDATE credit_requests SET status = 'approved' WHERE id = ?",
                        [requestId],
                        function(statusErr) {
                            if (statusErr) {
                                console.log("Error updating status:", statusErr);
                                return res.status(500).json({ message: "Failed to update request" });
                            }
                            
                            res.json({ message: "Credit request approved" });
                        }
                    );
                }
            );
        } else {
            database.run(
                "UPDATE credit_requests SET status = 'denied' WHERE id = ?",
                [requestId],
                function(denyErr) {
                    if (denyErr) {
                        console.log("Error denying request:", denyErr);
                        return res.status(500).json({ message: "Failed to deny request" });
                    }
                    
                    res.json({ message: "Credit request denied" });
                }
            );
        }
    });
}


function getPendingRequests(req, res) {
   
    req.skipCreditCheck = true;
    
    database.all(
        `SELECT cr.id, cr.user_id, cr.amount, cr.status, u.username 
         FROM credit_requests cr 
         JOIN users u ON cr.user_id = u.id 
         WHERE cr.status = 'pending'`, 
        [], 
        function(err, requests) {
            if (err) {
                console.log("Error fetching pending requests:", err);
                return res.status(500).json({ message: "Error fetching requests" });
            }
            
            res.json({ request: requests });
        }
    );
}


function resetAllCredits() {
    database.run("UPDATE users SET credits = 20", function(err) {
        if (err) {
            console.log("Failed to reset credits:", err);
        } else {
            let timestamp = new Date().toLocaleString();
            console.log("Credits reset at " + timestamp);
        }
    });
}

// For Exporting the functions
module.exports = {
    reduceCredits: deductUserCredit,
    requestCredits: submitCreditRequest,
    processCreditrequests: handleCreditRequest,
    getallCredits: getPendingRequests,
    resetDailycredits: resetAllCredits
};