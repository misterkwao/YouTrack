const express = require('express');
const router = express.Router();
const upload = require("../attachmentUpload")
const updateProfilePic = require("../userProfileUpload")
const {allowAccess} = require('../middleware/allowAccess')

const { 
    UserProfile,
    getLoggedUserData,
    updateLoggedUserData,
    deleteLoggedUserData,
    getAllProfiles,
    editSpecifiedUserRecord,
    getAllTransactions, } = require('../controllers/usersDataCtrl');  
const { addIncExp, getUserIncExp,updateIncExpData,deleteUserRecord} = require('../controllers/IncExpDataCtrl');

router.route('/').get(UserProfile).patch(updateProfilePic,updateLoggedUserData);
router.route('/data').get(getLoggedUserData).delete(deleteLoggedUserData);
router.route('/data/records').post(upload,addIncExp).get(getUserIncExp);
router.route('/data/records/:id').patch(upload,updateIncExpData).delete(deleteUserRecord);

//Higher level routes
router.route('/manageUsers').get(allowAccess,getAllProfiles)
router.route('/manageUsers/records').get(allowAccess,getAllTransactions)
router.route('/manageUsers/records/:id').patch([allowAccess,upload],editSpecifiedUserRecord)


module.exports = router;