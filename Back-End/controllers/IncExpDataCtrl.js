const IncExpData = require('../models/IncExpData');
const {StatusCodes} = require('http-status-codes');
const fs = require('fs');


const addIncExp = async (req,res) => {
   if(req.user){
      try {
         if(req.file){
            const path = req.file.filename;
            const data = await IncExpData.create({
             //this is spread out because i need to add the "createdBy" property
             recordType:req.body.recordType,
             amount:req.body.amount,
             pv:req.body.pv,
             attachmentUrl: `http://localhost:5000/api/v1/userAttachments/${req.user.userID}/${path}`,
             category:req.body.category,
             description:req.body.description,
             createdBy: req.user.userID,
             creatorName: req.user.name
            });
            res.status(StatusCodes.OK).json({msg:"Record added successfully"});
         }
         else{
            const data = await IncExpData.create({
               //this is spread out because i need to add the "createdBy" property
               recordType:req.body.recordType,
               amount:req.body.amount,
               pv:req.body.pv,
               category:req.body.category,
               description:req.body.description,
               createdBy: req.user.userID,
               creatorName: req.user.name
              });
              res.status(StatusCodes.OK).json({msg:"Record added successfully"});
         }
           
      } catch (error) {
          res.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
   }
   else{
      try {
         if(req.file){
            const path = req.file.filename;
            const data = await IncExpData.create({
             //this is spread out because i need to add the "createdBy" property
             recordType:req.body.recordType,
             amount:req.body.amount,
             pv:req.body.pv,
             attachmentUrl: `http://localhost:5000/api/v1/adminAttachments/${req.admin.adminID}/${path}`,
             category:req.body.category,
             description:req.body.description,
             createdBy: req.admin.adminID,
             creatorName: req.admin.name
            });
            res.status(StatusCodes.OK).json({msg:"Record added successfully"});
         }
         else{
            const data = await IncExpData.create({
               //this is spread out because i need to add the "createdBy" property
               recordType:req.body.recordType,
               amount:req.body.amount,
               pv:req.body.pv,
               category:req.body.category,
               description:req.body.description,
               createdBy: req.admin.adminID,
               creatorName: req.admin.name
              });
              res.status(StatusCodes.OK).json({msg:"Record added successfully"});
         }
           
      } catch (error) {
          res.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
   }
  
};

const updateIncExpData = async(req, res) => {
     if(req.user){
      try {
         if (!req.file){
            const updateRecord = await IncExpData.findByIdAndUpdate(req.params.id,{
               recordType:req.body.recordType,
               amount:req.body.amount,
               pv:req.body.pv,
               category:req.body.category,
               description:req.body.description,
               lastEditedBy: req.user.name})
               
            res.status(StatusCodes.OK).json({msg:"Record update successfull"})
         }
         else{
            const path = req.file.filename;
            const updateRecord = await IncExpData.findByIdAndUpdate(req.params.id,{
               recordType:req.body.recordType,
               amount:req.body.amount,
               pv:req.body.pv,
               attachmentUrl: `http://localhost:5000/api/v1/userAttachments/${req.user.userID}/${path}`,
               category:req.body.category,
               description:req.body.description,
               lastEditedBy: req.user.name
            })
            res.status(StatusCodes.OK).json({msg:"Record update successfull"})
         }
         
      } catch (error) {
         res.status(StatusCodes.OK).json(error.message);
      }
     }
     else{
      try {
         if (!req.file){
            const updateRecord = await IncExpData.findByIdAndUpdate(req.params.id,{
               recordType:req.body.recordType,
               amount:req.body.amount,
               pv:req.body.pv,
               category:req.body.category,
               description:req.body.description,
               lastEditedBy: req.user.name})
            res.status(StatusCodes.OK).json({msg:"Record update successfull"})
         }
         else{
            const path = req.file.filename;
            const updateRecord = await IncExpData.findByIdAndUpdate(req.params.id,{
               recordType:req.body.recordType,
               amount:req.body.amount,
               pv:req.body.pv,
               attachmentUrl: `http://localhost:5000/api/v1/adminAttachments/${req.admin.adminID}/${path}`,
               category:req.body.category,
               description:req.body.description,
               lastEditedBy: req.user.name
            })
            res.status(StatusCodes.OK).json({msg:"Record update successfull"})
         }
         
      } catch (error) {
         res.status(StatusCodes.OK).json(error.message);
      }
     }
};

const deleteUserRecord = async (req, res) => {
   if(req.user){
      try {
         const deleteRecordAttachement = await IncExpData.findById(req.params.id);
         if(deleteRecordAttachement.attachmentUrl){
            const filename = deleteRecordAttachement.attachmentUrl.split('/')[7]
            //Deleting user attachment
            if (fs.existsSync(`./userAttachments/${req.user.userID}/${filename}`)) {
               fs.rm(`./userAttachments/${req.user.userID}/${filename}`,{ recursive: true, force: true }, err => {
                  if (err) {
                     throw err;
                  }
               });
            
            }
         }
         
         const deleteRecord = await IncExpData.findByIdAndDelete(req.params.id)
         if(deleteRecord){
            res.status(StatusCodes.OK).json("Record deleted successfully");
         }
         else{
            res.status(StatusCodes.BAD_REQUEST).json(`No record with id: ${req.params.id} found`);
         }
            
         } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json(error.message);
         }
   }
   else{
      try {
         const deleteRecordAttachement = await IncExpData.findById(req.params.id);
         if(deleteRecordAttachement.attachmentUrl){
            const filename = deleteRecordAttachement.attachmentUrl.split('/')[7]
            //Deleting admin attachment
            if (fs.existsSync(`./adminAttachments/${req.admin.adminID}/${filename}`)) {
               fs.rm(`./adminAttachments/${req.admin.adminID}/${filename}`,{ recursive: true, force: true }, err => {
                  if (err) {
                     throw err;
                  }
               });
            
            }
         }
         
         const deleteRecord = await IncExpData.findByIdAndDelete(req.params.id)
         if(deleteRecord){
            res.status(StatusCodes.OK).json("Record deleted successfully");
         }
         else{
            res.status(StatusCodes.BAD_REQUEST).json(`No record with id: ${req.params.id} found`);
         }
   
} catch (error) {
   res.status(StatusCodes.BAD_REQUEST).json(error.message);
}
   }
}

const getUserIncExp = async (req, res) => {
   if(req.user){
      try {
         const data = await IncExpData.find({createdBy: req.user.userID}).sort({createdAt: -1});
         res.status(StatusCodes.OK).json({data});
      } catch (error) {
         res.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
   }
   else{
      try {
         const data = await IncExpData.find({createdBy: req.admin.adminID}).sort({createdAt: -1});
         res.status(StatusCodes.OK).json({data});
      } catch (error) {
         res.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
   }
};

//Routing is done in the usersRoutes file
module.exports = {
    addIncExp,
    getUserIncExp,
    updateIncExpData,
    deleteUserRecord
}