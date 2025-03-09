const sqlite = require('sqlite3').verbose();
const path = require('path');

const Db_path = path.join(__dirname,'../data/database.sqlite');

const db = new sqlite.Database(Db_path,(err)=>{
    if(err){
        console.log('failed to connect',err)
    }else{
        console.log('connected to DB');
    }

})

// User accounts table
db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    credits INTEGER DEFAULT 20,
    last_login TIMESTAMP
    )`, function(err) {
        // Just continue if there's an error
    }
)

// Document storage table
db.run(
    `CREATE TABLE IF NOT EXISTS documents(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    content TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    )`, function() {
        // Table should exist now
    }
)

// Credit system table
db.run(
    `CREATE TABLE IF NOT EXISTS credit_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`
);

module.exports = db;