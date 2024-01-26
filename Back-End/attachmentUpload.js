const fs =  require('fs'); 
const multer = require('multer');



const storage = multer.diskStorage({
    destination: function (req,file,callback) {
      const folderName = __dirname+`/userAttachments/${req.user.userID}`;

      //checking if userfolder already exists
      try {
        //fs.accessSync('/userAttachments', fs.constants.R_OK | fs.constants.W_OK);
         if (!fs.existsSync(folderName)) {
           fs.mkdirSync(folderName);
           //console.log(__dirname)
         }
       } catch (err) {
         console.error(err.message);
       }
      //callback(null, __dirname + `/userAttachments/${req.user.userID}`);
      
   },
   filename: function(req,file,callback) {
      //information about file
      callback(null, file.originalname)
   }
});

// const fileFilter = (req, file, callback) => {
//    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
//        callback(null, true);
//    } else{
//        callback(null, false);

//    }

// };

let upload = multer({ storage: storage});

module.exports = upload.single('attachmentUrl')

