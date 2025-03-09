const multer = require("multer");
const path = require("path");


let diskStore = multer.diskStorage({
   // Where to save uploaded files
   destination: function(req, file, callback) {
       // Send files to public/uploads directory
       callback(null, "public/uploads");
   },
   
   // How to name the saved files
   filename: function(req, file, callback) {
       
       let timestamp = new Date().getTime();
       let fileExt = path.extname(file.originalname);
       callback(null, timestamp + fileExt);
   }
});

function validateFileType(req, file, callback) {

   if (file.mimetype !== "text/plain") {

       let err = new Error("Only .txt files are allowed");
       return callback(err, false);
   }
   
   callback(null, true);
}


const uploader = multer({ 
   storage: diskStore, 
   fileFilter: validateFileType 
});


module.exports = uploader;