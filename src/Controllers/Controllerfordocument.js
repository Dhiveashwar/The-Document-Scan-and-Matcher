const fs = require('fs');
const path = require('path');
const db = require('../Config/db');
const matchDocuments = require('../utils/aiMatch');

/**
 * Handles document uploads from users
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const uploadDocument = async(req, res) => {
   
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadDir = path.join(__dirname, "../../public/uploads");
    const filePath = path.join(uploadDir, req.file.filename);
    const userid = req.user.id;

    fs.readFile(filePath, "utf-8", (err, content) => {
        if (err) {
            console.error("Error reading file:", err.message);
            return res.status(500).json({ message: "Error reading file" });
        }
        
        //For Storing the file info in database
        const query = `INSERT INTO documents (user_id, filename, content) VALUES (?, ?, ?)`;
        const params = [userid, req.file.filename, content];
        
        db.run(query, params, function(err) {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({message: "Failed to upload file to database"});
            }
            
            res.status(201).json({
                id: this.lastID,
                filename: req.file.filename,
                message: "File uploaded successfully"
            });
        });
    });
};

/**
 * Compares uploaded document against existing documents
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const matchDocumentAPI = async (req, res) => {
    const docId = req.params.docId;
    

    const targetQuery = `SELECT content FROM documents WHERE id = ?`;
    db.get(targetQuery, [docId], async (err, doc) => {
        if (err || !doc) {
            return res.status(404).json({ message: "Document not found" });
        }
        
        console.log("Uploaded Document Content:", doc.content);
        

        const comparisonQuery = `SELECT content FROM documents WHERE id != ?`;
        db.all(comparisonQuery, [docId], async (err, docs) => {
            if (err) {
                return res.status(500).json({ message: "Error retrieving documents for comparison" });
            }
            
            if (!docs.length) {
                return res.status(404).json({ message: "No documents available for comparison" });
            }
            
          
            let comparisonDocs = [];
            for (let i = 0; i < docs.length; i++) {
                comparisonDocs.push(docs[i].content);
            }
            
            console.log("Stored Documents for Matching:", comparisonDocs);
            
            try {
               
                const matchResults = await matchDocuments(doc.content, comparisonDocs);
                console.log("Matching Results:", matchResults);

                res.json({ matches: matchResults });
            } catch (error) {
                res.status(500).json({ message: "Error during document comparison", error: error.message });
            }
        });
    });
};

/**
 * Retrieves user's previous document scans
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUserPastScans = (req, res) => {
    const userId = req.user.id;
    
    // Query for user's recent scans
    const historyLimit = 10;
    const historyQuery = `
        SELECT id, filename 
        FROM documents 
        WHERE user_id = ? 
        ORDER BY id DESC 
        LIMIT ?
    `;
    
    db.all(historyQuery, [userId, historyLimit], (err, scans) => {
        if (err) {
            console.error("Error fetching scan history:", err);
            return res.status(500).json({ message: "Failed to retrieve scan history" });
        }
        
        res.json({ scans });
    });
};

module.exports = {
    matchDocumentAPI,
    uploadDocument,
    getUserPastScans
};
