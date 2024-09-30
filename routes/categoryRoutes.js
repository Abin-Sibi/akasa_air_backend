const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Category routes
router.post('/add-category', categoryController.addCategory);
router.get('/get-categories', categoryController.getCategories);
router.put('/edit-category/:id', categoryController.editCategory);
router.delete('/delete-category/:id', categoryController.deleteCategory);

module.exports = router;
