const Admin = require('../models/adminModel')
const jwt = require('jsonwebtoken')

const loginAdmin = async (req,res)=>{
    try{

        const {email,password} = req.body;
        console.log('helloo',req.body);
        const admin = await Admin.find({ email });
        console.log(admin)
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if(password === admin.password){
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // const isMatch = await bcrypt.compare(password, admin.password);
        // if (!isMatch) {
        //     return res.status(401).json({ message: "Invalid email or password" });
        // }
        const adminToken = jwt.sign({adminId:admin._id},process.env.JWT_SECRET,{expiresIn:'3h'});    
        res.status(200).json({adminToken,admin,message:'successfull'})
    }catch{
        res.status(500).json({message:"Internal server error"}) 
    }
}

module.exports = {loginAdmin}