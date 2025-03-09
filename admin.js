const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./src/data/database.sqlite');

const username = "admin";
const plainPassword = "admin123";

bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    
    db.run(`UPDATE users SET password = ? WHERE username = ?`, [hash, username], (err) => {
        if (err) {
            console.error("Error updating admin password:", err);
        } else {
            console.log("Admin password updated successfully.");
        }
        db.close();
    });
});