const jwtLib = require('jsonwebtoken');

// Get secret key from environment variables
const JWT_KEY = process.env.JWT_SECRET_KEY;

function authCheck(req, res, next) {
  
    let authHeader = req.header('Authorization');
    
    // Make sure we have a token and it's formatted correctly
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Missing or malformed auth header");
        return res.status(401).json({
            message: "access denied",
            error: "No valid authorization provided"
        });
    }
    
    try {
        // Extract the actual token from the header
        const fullToken = authHeader.substring(7);
        
        const cleanToken = fullToken.trim();
        
        //for Verifying the token
        const userInfo = jwtLib.verify(cleanToken, JWT_KEY);
        
        // Attach user info to request object
        req.user = userInfo;

        next();
    } catch (error) {

        console.log("Auth validation failed:", error.message);

        res.status(400).json({
            message: "Invalid token"
        });
    }
}

module.exports = authCheck;