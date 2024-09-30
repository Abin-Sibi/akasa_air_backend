const Category = require('../models/categoryModel');

// Add new category
exports.addCategory = async (req, res) => {
  try {
    const { categoryName, imageUrl } = req.body;

    // Check for duplicate category name
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const category = new Category({ categoryName, imageUrl });
    await category.save();
    res.status(201).json({ message: 'Category added successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Edit category
exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, imageUrl } = req.body;

    // Check for duplicate category name
    const existingCategory = await Category.findOne({ categoryName, _id: { $ne: id } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { categoryName, imageUrl },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
