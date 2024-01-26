const {StatusCodes} = require('http-status-codes');

const allowAccess = async (req, res,next) =>{
    if(req.user.role === "user"){
        res.status(StatusCodes.UNAUTHORIZED).json({msg:"Permission denied"});
    }
    else{
        next();
    }
}

const checkRole = async (req, res, next) =>{
    if(req.user){
        res.status(StatusCodes.UNAUTHORIZED).json({msg:"Permission denied"});
    }
    else{
        next();
    }
}

module.exports ={
    allowAccess,
    checkRole
}  
