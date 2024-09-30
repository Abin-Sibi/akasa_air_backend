const FoodItem = require('../models/foodItemModel');

// Function to add a new food item
const addFoodItem = async (req, res) => {
  const { foodName, price, description, category, stock,image,imageUrl } = req.body;
  console.log('helll',req.body)

  // Validate required fields
  if (!foodName || !price || !description || !category || !stock) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {  
    const newFoodItem = new FoodItem({
      foodName,
      price,
      description,
      category,
      stock,
      imageUrl,
    });

    // Save the food item to the database
    await newFoodItem.save();
    
    res.status(201).json({ message: 'Food item added successfully', foodItem: newFoodItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// router.put('/update-food-item/:id',
const updateItem = async (req, res) => {
    const { id } = req.params;
    const { foodName, price, description, category, stock, imageUrl } = req.body;
  
    try {
      // Find food item by ID and update
      const updatedFoodItem = await FoodItem.findByIdAndUpdate(
        id,
        {
          foodName,
          price,
          description,
          category,
          stock,
          imageUrl,
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedFoodItem) {
        return res.status(404).json({ message: 'Food item not found' });
      }
  
      res.status(200).json({ message: 'Food item updated successfully', updatedFoodItem });
    } catch (error) {
      console.error('Error updating food item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


//   router.delete('/delete-food-item/:id',
  const deleteFoodItem =  async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedFoodItem = await FoodItem.findByIdAndDelete(id);
  
      if (!deletedFoodItem) {
        return res.status(404).json({ message: 'Food item not found' });
      }
  
      res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (error) {
      console.error('Error deleting food item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

const getAllfood = async (req, res) => {
    try {
      const foodItems = await FoodItem.find(); // Fetch all food items from the database
      res.status(200).json(foodItems); // Send back the food items as JSON
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

module.exports = {addFoodItem,updateItem,getAllfood,deleteFoodItem}