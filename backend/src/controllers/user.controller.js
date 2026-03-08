const userModel = require('../models/user.model');
async function getCurrentUserController(req,res){
    try {
        const userId = req.userId;
        const user = await  userModel.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }
        return res.status(200).json({
            message:"User found",
            user
        })
    } catch (error) {
        return res.status(500).json({
                message:"Get current user Error"
            })
    }

}

module.exports = {getCurrentUserController};