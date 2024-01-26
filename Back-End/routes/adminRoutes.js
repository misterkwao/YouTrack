const express = require('express');
const router = express.Router();
const upload = require("../adminattachmentUpload")
const updateProfilePic = require("../adminProfileUpload")
const {checkRole} = require('../middleware/allowAccess')
const {   
    AdminProfile,
    getLoggedAdminData,
    updateLoggedAdminData,
    deleteLoggedAdminData,
    getAllProfiles,
    createUser,
    deleteUserData,
    editUserPermissions
    //addAdminID
} = require('../controllers/adminDataCtrl');
const { addIncExp, getUserIncExp,updateIncExpData,deleteUserRecord} = require('../controllers/IncExpDataCtrl');

router.route('/').get(AdminProfile).patch(updateProfilePic,updateLoggedAdminData);
router.route('/manageuser').post(checkRole,createUser).get(checkRole, getAllProfiles);
router.route('/manageuser/:id').delete(checkRole,deleteUserData).patch(checkRole,editUserPermissions)
//router.route('/addID').patch(addAdminID)
router.route('/data').get(getLoggedAdminData).delete(deleteLoggedAdminData);
router.route('/data/records').post(upload,addIncExp).get(getUserIncExp);
router.route('/data/records/:id').patch(upload,updateIncExpData).delete(deleteUserRecord);

module.exports = router;