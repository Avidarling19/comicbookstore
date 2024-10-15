// controllers/comicController.js
const Comic = require('../models/comicModel');

// Create a comic book
//A simple post request which has the details in the form of json as req body 
exports.createComic = async (req, res) => {
  try {
    const comic = new Comic(req.body);
    await comic.save();
    res.status(201).json(comic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Edit a comic book
// Over here we send the attributes we want to changes in the req body in the form of json
//I have used put request but we can also used pach request here
exports.updateComic = async (req, res) => {
  try {
    const comic = await Comic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comic) return res.status(404).json({ message: 'Comic not found' });
    res.json(comic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a comic book
exports.deleteComic = async (req, res) => {
  try {
    const comic = await Comic.findByIdAndDelete(req.params.id);
    if (!comic) return res.status(404).json({ message: 'Comic not found' });
    res.json({ message: 'Comic deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all comics with pagination, sorting, and filtering
// Example api endpoints are as below 
//GET http://localhost:3000/api/comics?author=Stan%20Lee&condition=new&sortBy=yearOfPublication
// GET http://localhost:3000/api/comics?price=20&page=1&limit=10
// GET http://localhost:3000/api/comics?page=2&limit=5&sortBy=price


exports.getComics = async (req, res) => {
    try {
      // Destructure and sanitize query parameters
      const { author, year, price, condition, page = 1, limit = 10, sortBy = 'price' } = req.query;
      
      // Build the filter object
      const filter = {};
  
      // Filtering by author (case-insensitive)
      if (author) {
        filter.author = new RegExp(author, 'i');  // Using regex for case-insensitive match
      }
      
      // Filter by year of publication
      if (year) {
        filter.yearOfPublication = year;
      }
  
      // Filter by price (less than or equal to the specified price)
      if (price) {
        filter.price = { $lte: price };
      }
  
      // Filter by condition (e.g., 'new' or 'used')
      if (condition) {
        filter.condition = condition;
      }
  
      // Convert page and limit to numbers
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
  
      // Query the database with filters, sorting, and pagination
      const comics = await Comic.find(filter)
        .sort({ [sortBy]: 1 })  // Sort in ascending order, change to -1 for descending
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
  
      // Respond with the results
      res.json(comics);
      
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

// Get comic book details by ID
exports.getComicDetails = async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) return res.status(404).json({ message: 'Comic not found' });
    res.json(comic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
