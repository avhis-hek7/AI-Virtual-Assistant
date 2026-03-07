const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    assistantName:{
        type:String

    },
    assistantImage:{
        type:String
    },
    history:[
        {type:String}
    ]


},{timestamps:true})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash;
    return 
})

userSchema.methods.generateToken = async function(){
    return jwt.sign({userId:this._id},process.env.JWT_SECRET, {expiresIn:'7d'})

}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;