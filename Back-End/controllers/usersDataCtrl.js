const Users = require('../models/usersData');
const Admins = require('../models/adminData');
const User = require('../models/User');
const IncExpData = require('../models/IncExpData');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors')
const fs = require('fs');

const UserProfile = async(req, res) =>{
    try {
       const user = await Users.findOne({owner:req.user.userID});
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error });
    }
}

const getLoggedUserData = async (req, res) => {
    try {
         switch(req.query.filterBy){
              case "week":
                 //filter by week
                    const filterByWeek = await IncExpData.aggregate([{
                            
                        $facet:{
                            "weekDayTotals":  [
                            
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.user.userID } ] } } },
                                
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
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.user.userID } ] } } },
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
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.user.userID } ] } } },
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
                            { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.user.userID } ] } } },
                        
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
                            { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.user.userID } ] } } },
                        
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
                            { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.user.userID } ] } } },
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
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.user.userID } ] } } },
                            
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
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.user.userID } ] } } },
                            
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
                                { $match: { $expr : { $eq: [ '$createdBy' , { $toObjectId: req.user.userID } ] } } },
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

const updateLoggedUserData = async (req, res) => {
    
    try {
        if(!req.body.userCategory && !req.file){
            if(req.body.user){
                const loggedUser = await Users.findOneAndUpdate({owner: req.user.userID},{...req.body}, {new: true,runValidators: true});
                  await User.findByIdAndUpdate(loggedUser.owner,{name: req.body.user})
                //updating user records name upon name change
                const updateUserRecords = await IncExpData.updateMany(
                    { createdBy: { $eq: req.user.userID } },
                    { $set: { "creatorName" : req.body.user } }
                );
                res.status(StatusCodes.OK).json({msg:"Updated successfully"});
            }
            else{
                const loggedUser = await Users.findOneAndUpdate({owner: req.user.userID},{...req.body}, {new: true,runValidators: true});
                res.status(StatusCodes.OK).json({msg:"Updated successfully"});
            }
        }
        else if(req.file){
            const path = req.file.filename;
           const  loggedUser = await Users.findOneAndUpdate({owner: req.user.userID},{profilePictureURL:`http://localhost:5000/api/v1/userprofilepictures/${req.user.userID}/${path}`});
            res.status(StatusCodes.OK).json({msg:"Updated successfully"});
        }
        else{
            //This is isolated because there is no way a user would be doing a transaction and adding categories at the same time
                const loggedUser = await Users.findOneAndUpdate({owner: req.user.userID},{$push: {userCategory:req.body.userCategory}}, {new: true,runValidators: true});
                res.status(StatusCodes.OK).json({msg:"Updated successfully"});
        }
     } catch (error) {
         res.status(StatusCodes.BAD_REQUEST).json({ error });
     }
};

const deleteLoggedUserData = async (req, res) => {
    try {
        //Deleting user attachments
        if (fs.existsSync(`./userAttachments/${req.user.userID}`) || fs.existsSync(`./userprofilepictures/${req.user.userID}`)) {

            // deleting attachments will alter the integrity of the data
            // fs.rm(`./userAttachments/${req.user.userID}`,{ recursive: true, force: true }, err => {
            //     if (err) {
            //         console.log(err)
            //     }
            // });

            fs.rm(`./userprofilepictures/${req.user.userID}`,{ recursive: true, force: true }, err => {
                if (err) {
                    console.log(err)
                }
            });
            console.log("folders deleted");
        }
        //Deleting current user's data
            const loggedUser = await Users.findOneAndDelete({createdBy: req.user.userID});
            // const result = await IncExpData.deleteMany({ createdBy: req.user.userID }); // deleting records will alter the integrity of the data
            const user = await User.findOneAndDelete({_id: req.user.userID})
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

//Higher level functionality
const getAllProfiles = async (req, res) => {
    try {
        const admins = await Admins.find({});
        const users = await Users.find({});

        //Filtered based on current year
        const data = await IncExpData.aggregate([{
            $facet:{
                "data":  [
                    { 
                        $group: {
                            _id: {"year":{"$year": "$createdAt"}},
                            "transactions":{"$push": "$$CURRENT"}
                            }
                    },
                    {$sort: {_id: -1}},
                    {$limit: 1}
                ],
                "amounts" : [
                    { 
                        $group: {
                            _id: {"year":{"$year": "$createdAt"}},
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
                    {
                        $group:{
                            _id:{"year":{"$year": "$createdAt"},"category":"$category",},
                            "totalAmt":{'$sum':"$amount"}
                        }
                    },
                    {$sort: {totalAmt: -1}},
                    
                ]
            } 
        }]);

       let transactions = data[0].data[0].transactions; //for single user filtering
       let totalAmounts = data[0].amounts[0];
       let categories = data[0].catergoryTotals

        if(users && data){
            let usersArr = [];
            for(let i = 0; i < users.length; i++) {

                //creating an object to hold user information
               let usersObj = {};
                usersObj.name = users[i].user;
                usersObj.profilePictureURL = users[i].profilePictureURL;
                usersObj.currencyType = users[i].currencyType;
                //

                let totalIncome = 0;
                let totalExpense = 0
                for(let j = 0; j < transactions.length; j++) {
                    if((transactions[j].createdBy).toJSON() === (users[i].owner).toJSON()){
                        if(transactions[j].recordType === "income"){
                            totalIncome += transactions[j].amount;
                        }
                        else{
                            totalExpense += transactions[j].amount;
                        }
                        
                    }
                }
                usersObj.totalIncome = totalIncome;
                usersObj.totalExpense = totalExpense;
                usersObj.currentAmount = (totalIncome - totalExpense)

            //storing in array of users
            usersArr.push(usersObj);
        }
        res.status(StatusCodes.OK).json({users: usersArr,totalAmounts: totalAmounts,categories: categories});
        }
         
        // res.status(StatusCodes.OK).json({admins, users,adminTotal: admins.length, userTotal: users.length});
     } catch (error) {
         res.status(StatusCodes.BAD_REQUEST).json( error );
     }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await IncExpData.find({});
        res.status(StatusCodes.OK).json({transactions});
        } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json( error );
    }
}

// const getSpecifiedUserRecords = async (req, res) => {
//     try {
//         const data = await IncExpData.find({createdBy:req.query.createdBy});
//         res.status(StatusCodes.OK).json(data)
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json( error );
//     }
// };

const editSpecifiedUserRecord = async (req, res) => {
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
    res.status(StatusCodes.BAD_REQUEST).json( error );
 }
}


module.exports = {
    UserProfile,
    getLoggedUserData,
    updateLoggedUserData,
    deleteLoggedUserData,
    getAllProfiles,
    editSpecifiedUserRecord,
    getAllTransactions,
}