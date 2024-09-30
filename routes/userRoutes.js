const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController')
const auth = require('../middlewares/authMiddleware'); 


router.post('/register',userControllers.registerUser)
router.post('/login',userControllers.loginUser)
router.post('/:userId/address',userControllers.addAddress)
router.get('/:userId/addresses',userControllers.getAddress);
router.put('/:userId/address/:addressId',userControllers.editAddress);
router.delete('/:userId/address/:addressId',userControllers.deleteAddress);

module.exports = router;