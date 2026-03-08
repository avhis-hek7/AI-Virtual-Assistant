const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authMiddleware(req,res,next){
    try {
        const token = req.cookies.token || req.headers.authorization?.split('')[1];
        if(!token){
            return res.status(401).json({
                message:"Unauthorized access, token is missing!"
            })
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifyToken.userId;
        return next()
      
        return next()

    } catch (error) {
        return res.status(401).json({
                message:"Unauthorized access, token is invalid!"
            })
        
    }
}

module.exports = {authMiddleware};