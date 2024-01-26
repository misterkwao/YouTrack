const jwt = require('jsonwebtoken');
const Users = require('../models/usersData');
const { UnauthenticatedError } = require('../errors');
const {StatusCodes} = require('http-status-codes');

let Auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer')){
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid authorization header"})
    }
    else{
        const token = authHeader.split(' ')[1];
        try {
            const payload = jwt.verify(token, process.env.JWT_Secret)
            if (payload.userID){
                req.user = { userID: payload.userID, name: payload.name};
                const user = await Users.findOne({owner:req.user.userID});
                req.user.role = user.role;
            }
            else{
                req.admin = { adminID: payload.adminID, name: payload.name}
            }
            next();
        } catch (error) {
            //throw new UnauthenticatedError('Authentication Invalid');
            res.status(StatusCodes.BAD_REQUEST).json({ msg: error})
        }
    }


};
module.exports = Auth;