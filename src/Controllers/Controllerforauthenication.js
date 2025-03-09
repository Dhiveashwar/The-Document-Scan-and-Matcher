const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Config/db');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

//For the user registration:
const register = async(req,res)=>{
    const{username,password} = req.body; 
    const hashpassword = await bcrypt.hash(password,10)  

    db.run(
        `INSERT INTO users (username,password) VALUES (?,?)`,
        [username,hashpassword],
        function(err){
            if(err){
               console.log(err.message); 
               return res.status(500).json({message:"user exists already"})
            }
            res.json({id:this.lastID,username});
        }
    )
}


const userlogin = (req,res) => {
    const{username,password} = req.body;


    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign(
            {id: 1, username: 'admin', role: 'admin'},
            SECRET_KEY,
            {expiresIn:"24h"}
        );
        
        return res.json({
            message: "Admin login successful",
            token: token,
            role: 'admin'
        });
    }


    db.get(
        `SELECT * FROM users WHERE username=?`, [username],
        function(err,user){
            if(err || !user){
                return res.status(400).json({message:"Invalid username"})
            }

            bcrypt.compare(password, user.password)
                .then(isValid => {
                    if(!isValid){
                        return res.status(400).json({message:'Invalid password'})
                    }

                    const token = jwt.sign(
                        {id:user.id, username:user.username, role: user.role},
                        SECRET_KEY,
                        {expiresIn:"24h"}
                    ); 
                    
                    res.json({
                        message: "Login successful",
                        token: token,
                        role: user.role
                    });
                })
                .catch(error => {
                    console.error("Password comparison error:", error);
                    return res.status(500).json({message: "Login error"});
                });
        }
    )
}

// This for user profile
const userProfile = async(req,res)=>{
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    const userid = req.user.id; 

    db.get(
        `SELECT id,username,credits,role FROM users WHERE id = ?`,[userid],
        function(err,user){   
            if(err || !user){
                return res.status(404).json({message:"user not found"}); 
            }
            res.json(user);
        }
    )
}

module.exports = {register,userlogin,userProfile};