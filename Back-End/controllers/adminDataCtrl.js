const Admins = require('../models/adminData');
const Users = require('../models/usersData');
const User = require('../models/User');
const Profile = require('../models/usersData');
const Admin = require('../models/User');
const IncExpData = require('../models/IncExpData');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors')
const fs = require('fs');

//Admin methods
const AdminProfile = async(req, res) =>{
    try {
       const admin = await Admins.findOne({createdBy:req.admin.adminID});
        res.status(StatusCodes.OK).json(admin);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json( error );
    }
}

const getLoggedAdminData = async (req, res) => {
    try {
         switch(req.query.filterBy){
              case "week":
                 //filter by week
                    const filterByWeek = await IncExpData.aggregate([{
                            
                        $facet:{
                            "weekDayTotals":  [
                            
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.admin.adminID } ] } } },
                                
                                { 
                                    $group: {_id: {"year":{"$year": "$createdAt"},"month":{"$month":"$createdAt"},"week":{"$week": "$createdAt"},"day":{"$dayOfWeek": "$createdAt"}}, 
                                        "income": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'income']},'$amount', 0]}},
                                        "expense": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'expense']},'$amount', 0]}},
                                         //"all":{"$push":"$group"}
                                   }
                                },
                                {$sort: {_id: -1}},
                                {$limit :7},
                            //     {
                                    
                            //         $project: {
                            //                 week:{
                            //                     $filter: {
                            //                        input: "$all",
                            //                        cond: { $eq: [ "$$this.all", "$$this.all" ] }
                            //                     }
                            //                 }  
                            //          }
                                     
                            //     },
                            //     {$sort: {_id: -1}}
 
                            ],
                            
                            "Totals":  [
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.admin.adminID } ] } } },
                            
                                { 
                                    $group: {
                                        _id: {"year":{"$year": "$createdAt"},"month":{"$month":"$createdAt"},"week":{"$week": "$createdAt"}},
                                        "transactions":{"$push": "$$CURRENT"},
                                        "totalIncome": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'income']},'$amount', 0]}},
                                        "totalExpense": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'expense']},'$amount', 0]}}
                                        }
                                },
                                {
                                    $addFields:{
                                        currentAmount: { $subtract:["$totalIncome","$totalExpense"]}
                                    }
                                },
                                {$sort: {_id: -1}},
                                {$limit: 1}
                            ],
                            "catergoryTotals":[
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.admin.adminID } ] } } },
                                {
                                    $group:{
                                        _id:{"year":{"$year": "$createdAt"},"month":{"$month":"$createdAt"},"week":{"$week": "$createdAt"},"category":"$category",},
                                        "totalAmt":{'$sum':"$amount"}
                                    }
                                },
                                {$sort: {_id: -1}},
                                
                            ]
                        }         
                     }
                    ]);
                    res.status(StatusCodes.OK).json(filterByWeek);
        //end
                break;
              case "month":
                   //filter by month(Same year)
                   const filterByMonth = await IncExpData.aggregate([{
                        
                    $facet:{
                        "monthData":  [
                            { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.admin.adminID } ] } } },
                        
                            { 
                                $group: {
                                    _id: {"year":{"$year": "$createdAt"},"month":{"$month": "$createdAt"},"day":{"$dayOfMonth": "$createdAt"}},
                                    "income": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'income']},'$amount', 0]}},
                                    "expense": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'expense']},'$amount', 0]}},
                                    "transactions":{"$push": "$$ROOT"}
                                    }
                            },
                            {$sort: {_id: -1}}
                        ],
                        "Totals":  [
                            { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.admin.adminID } ] } } },
                        
                            { 
                                $group: {
                                    _id: {"year":{"$year": "$createdAt"},"month":{"$month": "$createdAt"}},
                                    "totalIncome": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'income']},'$amount', 0]}},
                                    "totalExpense": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'expense']},'$amount', 0]}},
                                    }
                            },
                            {
                                $addFields:{
                                    currentAmount: { $subtract:["$totalIncome","$totalExpense"]}
                                }
                            },
                            {$sort: {_id: -1}}
                        ],
                        "catergoryTotals":[
                            { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.admin.adminID } ] } } },
                            {
                                $group:{
                                    _id:{"category":"$category","year":{"$year": "$createdAt"},"month":{"$month": "$createdAt"}},
                                    "totalAmt":{'$sum':"$amount"}
                                }
                            },
                            {$sort: {_id: -1}}
                        ]
                    }
                        
                }]
                    );
                res.status(StatusCodes.OK).json(filterByMonth);
        //end 
                break;
            default: 
                   //Year default
                    const filterByYear = await IncExpData.aggregate([{
                        
                        $facet:{
                            "yearMonthTotals":  [
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.admin.adminID } ] } } },
                            
                                { 
                                    $group: {
                                        _id: {"year":{"$year": "$createdAt"},"month":{"$month": "$createdAt"}},
                                        "totalIncome": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'income']},'$amount', 0]}},
                                        "totalExpense": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'expense']},'$amount', 0]}},
                                        }
                                },
                              {$sort: {_id: -1}},
                              {$limit: 12}
                            ],
                            "Totals":  [
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.admin.adminID } ] } } },
                            
                                { 
                                    $group: {
                                        _id: {"year":{"$year": "$createdAt"}},
                                        "transactions":{"$push": "$$ROOT"},
                                        "totalIncome": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'income']},'$amount', 0]}},
                                        "totalExpense": { '$sum': {'$cond': [{ '$eq': ['$recordType', 'expense']},'$amount', 0]}},
                                        }
                                },
                                {
                                    $addFields:{
                                        currentAmount: { $subtract:["$totalIncome","$totalExpense"]}
                                    }
                                },
                           {$sort: {_id: -1}},
                           {$limit: 1}
                            ],
                            "catergoryTotals":[
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.admin.adminID } ] } } },
                                {
                                    $group:{
                                        _id:{"category":"$category","year":{"$year": "$createdAt"}},
                                        "totalAmt":{'$sum':"$amount"}
                                    }
                                },
                              {$sort: {_id: -1}}
                            ]
                        }     
                    }
                ]);
                    res.status(StatusCodes.OK).json(filterByYear);
        //end of year
         }
     } catch (error) {
         res.status(StatusCodes.BAD_REQUEST).json({msg: error.message});
     }
};

const updateLoggedAdminData = async (req, res) => {
    
    try {
        if(!req.body.userCategory && !req.file){
            const loggedAdmin = await Admins.findOneAndUpdate({createdBy: req.admin.adminID},{...req.body}, {new: true,runValidators: true});
            res.status(StatusCodes.OK).json({msg:"Updated successfully"});
        }
        else if(req.file){
            const path = req.file.filename;
           const  loggedAdmin = await Admins.findOneAndUpdate({createdBy: req.admin.adminID},{profilePictureURL:`http://localhost:5000/api/v1/adminprofilepictures/${req.admin.adminID}/${path}`});
            res.status(StatusCodes.OK).json({msg:"Updated successfully"});
        }
        else{
            //This is isolated because there is no way a admin would be doing a transaction and adding categories at the same time
                const loggedAdmin = await Admins.findOneAndUpdate({createdBy: req.admin.adminID},{$push: {adminCategory:req.body.adminCategory}}, {new: true,runValidators: true});
                res.status(StatusCodes.OK).json({msg:"Updated successfully"});
        }
     } catch (error) {
         res.status(StatusCodes.BAD_REQUEST).json({ error });
     }
};

const deleteLoggedAdminData = async (req, res) => {
    try {
        //Deleting admin attachments
        if (fs.existsSync(`./adminAttachments/${req.admin.adminID}`) || fs.existsSync(`./adminprofilepictures/${req.admin.adminID}`)) {
            fs.rm(`./adminAttachments/${req.admin.adminID}`,{ recursive: true, force: true }, err => {
                if (err) {
                    console.log(err)
                }
            });

            fs.rm(`./adminprofilepictures/${req.admin.adminID}`,{ recursive: true, force: true }, err => {
                if (err) {
                    console.log(err)
                }
            });
            console.log("folders deleted");
        }
        //Deleting current admin's data
            const loggedAdmin = await Admins.findOneAndDelete({createdBy: req.admin.adminID});
            const result = await IncExpData.deleteMany({ createdBy: req.admin.adminID });
            const admin = await Admin.findOneAndDelete({_id: req.admin.adminID})
            if (!loggedAdmin && !admin) {
                    res.status(StatusCodes.BAD_REQUEST).json({msg: 'Admin does not exist'});
                  }
                else{
                    res.status(StatusCodes.OK).json({msg: 'Admin deleted successfully'});
                }
                
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
}
//End of Admin methods



//Other methods


const createUser = async (req,res)=>{
    //creating users and assigning roles and permissions
    try {
        const user = await User.create({...req.body});
        //creating a user profile upon account creation
        const profile = await Profile.create({user: user.name,owner: user._id, role: req.body.role, permissions: req.body.permissions});
        res.status(StatusCodes.CREATED).json({msg: "User created"});
    } catch (error) {
        //res.status(StatusCodes.BAD_REQUEST).json(error.message)
        res.status(StatusCodes.OK).json({msg: "Email is already registered"});
    }
}

const editUserPermissions = async (req,res)=>{
    let profile_ID = req.params.id;
    try {
        const user_profile = await Profile.findByIdAndUpdate(profile_ID, req.body);
        res.status(StatusCodes.OK).json({msg: "Edit successful"});
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({msg: 'Edit failed'});
    }
}

const deleteUserData = async (req, res) => {
    let userID = req.params.id;
    try {
        //Deleting user attachments
        if (fs.existsSync(`./userAttachments/${userID}`) || fs.existsSync(`./userprofilepictures/${userID}`)) {

            // deleting attachments will alter the integrity of the data
            // fs.rm(`./userAttachments/${userID}`,{ recursive: true, force: true }, err => {
            //     if (err) {
            //         console.log(err)
            //     }
            // });

            fs.rm(`./userprofilepictures/${userID}`,{ recursive: true, force: true }, err => {
                if (err) {
                    console.log(err)
                }
            });
            console.log("folder deleted");
        }
        //Deleting current user's data
            const loggedUser = await Users.findOneAndDelete({owner: userID});
            // const result = await IncExpData.deleteMany({ createdBy: userID }); // deleting records will alter the integrity of the data
            const user = await User.findOneAndDelete({_id: userID}); //
            if (!loggedUser && !user) {
                    res.status(StatusCodes.BAD_REQUEST).json({msg: 'User does not exist'});
                  }
                  else{
                      res.status(StatusCodes.OK).json({msg: 'User deleted successfully'});
                  }
                
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
}

const getAllProfiles = async (req, res) => {
    try {
        const admins = await Admins.find({});
        const users = await Users.find({});
         res.status(StatusCodes.OK).json({admins, users,adminTotal: admins.length, userTotal: users.length});
     } catch (error) {
         res.status(StatusCodes.BAD_REQUEST).json( error );
     }
};


//End of other methods



module.exports = {
    AdminProfile,
    getLoggedAdminData,
    updateLoggedAdminData,
    deleteLoggedAdminData,
    getAllProfiles,
    createUser,
    deleteUserData,
    editUserPermissions
    //addAdminID
}