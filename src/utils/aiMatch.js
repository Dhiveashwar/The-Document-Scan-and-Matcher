// Import HTTP client library
const axios = require("axios");

/**
 * Compares documents using Google's Gemini AI
 */
function matchDocuments(documentText, storedDocuments) {
    return new Promise(async (resolve, reject) => {
        // Get API key from environment
        var API_KEY = process.env.GEMINI_API_KEY;
        
        // Make sure we have API key
        if (!API_KEY) {
            console.error("Error: Google Gemini API key is missing.");
            return resolve([]);
        }
        
        // Prepare request to Gemini
        let apiEndpoint = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
        let apiUrl = `${apiEndpoint}?key=${API_KEY}`;
        
        // Format text for comparison
        let allDocs = storedDocuments.join("\n\n");
        let prompt = `Find the most similar document from the following dataset:\n\n${allDocs}\n\nDocument to match:\n${documentText}`;
        
        // Prepare request body
        let reqBody = {
            contents: [
                { 
                    role: "user", 
                    parts: [{ text: prompt }] 
                }
            ]
        };
        
        // Send request
        try {
            let result = await axios.post(
                apiUrl,
                reqBody,
                {
                    headers: { 
                        "Content-Type": "application/json" 
                    }
                }
            );
            
            // Log response for debugging
            console.log("Gemini API Response:", result.data);
            
            // Extract the actual result text
            let responseText = "";
            
            if (result.data && 
                result.data.candidates && 
                result.data.candidates[0] && 
                result.data.candidates[0].content && 
                result.data.candidates[0].content.parts) {
                
                // Combine all text parts
                for (let i = 0; i < result.data.candidates[0].content.parts.length; i++) {
                    responseText += result.data.candidates[0].content.parts[i].text;
                }
            } else {
                responseText = "No match found";
            }
            
            resolve(responseText);
            
        } catch (err) {
            // Handle errors
            console.error("Gemini API Error:", err.response?.data || err.message);
            resolve([]);
        }
    });
}

// Export function
module.exports = matchDocuments;