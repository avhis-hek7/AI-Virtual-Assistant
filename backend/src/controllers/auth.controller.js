const userModel = require('../models/user.model');


async function userRegisterController(req,res){
    try {
        const {name, email, password} = req.body;

        const isUserExists = await userModel.findOne({email:email})
        if(isUserExists){
            return res.status(422).json({
                message:"User already exists with this email!."
            })
        }
        if(password.length < 6){
            return res.status(422).json({
                message:"Password must be atleast six character!"
            })
        }
        const user = await userModel.create({
            name,email,password
        })

        const token = await user.generateToken();

        res.cookie("token", token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:false

        })
        return res.status(201).json({
            message:"User create successfully",
            user:{
                _id:user._id,
                email:user.email,
                name:user.name
            }
        })
        
    } catch (error) {
        return res.status(500).return({
            message:`Sign up error ${error}`
        })
    }
}

async function userLoginController(req,res){

    try{
    const {email, password} = req.body;
    
    const isUserExists = await userModel.findOne({email:email})

    if(!isUserExists){
        return res.status(401).json({
            message:"Inavlid login credentials!"
        })
    }

    const isValidPassword = await isUserExists.comparePassword(password)
    if(!isValidPassword){
        return res.status(401).json({
            message:"Inavalid login credentials!"
        })
    }
    const token = await isUserExists.generateToken();

    res.cookie("token", token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:false

        })
     return res.status(200).json({
        message:"Login successfully",
        isUserExists:{
            _id:isUserExists._id,
            name:isUserExists.name,
            email:isUserExists.email


        }
    })}
    catch(error){
        return res.status(500).return({
            message:`Login error ${error}`
        })

    }    

}


async function userLogoutController(req,res){
    try {
        res.clearCookie("token")
        return res.status(200).json({
            message:"Logout sucessfully"
        })
    } catch (error) {
        return res.status(500).return({
            message:`Logout error ${error}`
        })
    }
}