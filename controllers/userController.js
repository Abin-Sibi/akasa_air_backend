const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const registerUser = async (req,res)=>{
   console.log(req.body)
   const { name,email, password } = req.body;
   const hashedPassword = await bcrypt.hash(password,10);
   const newUser = new User({name,email,password:hashedPassword});
   await newUser.save();
   res.status(200).json({message:"Registered"});  
}

const loginUser = async (req,res)=>{
    try{

        const {email,password} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'3h'});    
        res.status(200).json({token,user,message:'successfull'})
    }catch{
        res.status(500).json({message:"Internal server error"}) 
    }
}


// Route to add an address for a specific user
// exports.post('/:userId/address', 
   const addAddress= async (req, res) => {
  const { userId } = req.params;
  console.log('helloo',req.body)
  const address = req.body; // The address data is expected in the request body

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the default flag to true if it's the first address
    if (user.addresses.length === 0) {
      address.default = true;
    }

    user.addresses.push(address);
    await user.save();

    res.status(200).json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error });
  }
};

// Route to get all addresses for a user
// router.get('/:userId/addresses',
    const getAddress = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error });
  }
};

// Route to update an existing address
// router.put('/:userId/address/:addressId',
    const editAddress = async (req, res) => {
  const { userId, addressId } = req.params;
  const updatedAddress = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.addresses[addressIndex] = { ...user.addresses[addressIndex]._doc, ...updatedAddress };
    await user.save();

    res.status(200).json({ message: 'Address updated successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error });
  }
};

// Route to delete an address
// router.delete('/:userId/address/:addressId',
    
    const deleteAddress = async (req, res) => {
  const { userId, addressId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    res.status(200).json({ message: 'Address deleted successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error });
  }
};




module.exports = {registerUser,loginUser ,addAddress,editAddress,getAddress,deleteAddress}