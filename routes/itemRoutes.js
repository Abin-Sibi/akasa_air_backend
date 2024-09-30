const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middlewares/authMiddleware'); 

router.post('/add-food-item',itemController.addFoodItem);
router.post('/update-food-item',itemController.updateItem);
router.get('/get-all-food',itemController.getAllfood)
router.put('/update-food-item/:id',itemController.updateItem);
router.delete('/delete-food-item/:id',itemController.deleteFoodItem);

module.exports = router;