const multer = require('multer');
const path = require('path');
const fs = require('fs');


// TO SAVE FILES LOCALLY

// Configure Multer storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const uploadDir = './uploads/';

//         // Create uploads directory if it doesn't exist
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true });
//         }

//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });


// Configure Multer instance
// const uploadFile = multer({
//     storage: storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB limit
//         files: 5 // Maximum 5 files
//     }
// });





// TO SAVE FILES IN ANOTHER SERVER
const storage = multer.memoryStorage(); // Store in memory



const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5
    }
});

module.exports = { uploadFile };