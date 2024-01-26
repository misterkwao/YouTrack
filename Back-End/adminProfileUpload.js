const fs =  require('fs'); 
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req,file,callback) {
      const folderName = `/adminprofilepictures/${req.admin.adminID}`;

      //checking if adminfolder already exists
      try {
        //fs.accessSync('/adminAttachments', fs.constants.R_OK | fs.constants.W_OK);
         if (!fs.existsSync(folderName)) {
           fs.mkdirSync(folderName);
           console.log("folder created successfully")
         }
       } catch (err) {
         console.error(err);
       }
      callback(null, __dirname + `/adminprofilepictures/${req.admin.adminID}`);
      
   },
   filename: function(req,file,callback) {
      //information about file
      callback(null, file.originalname)
   }
});

const fileFilter = (req, file, callback) => {
   if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
       callback(null, true);
   } else{
       callback(null, false);

   }

};

let upload = multer({ storage: storage, fileFilter: fileFilter,});

module.exports = upload.single('profilePictureURL');

