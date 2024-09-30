const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')


router.post('/adminlogin',adminController.loginAdmin)

module.exports = router;