/* eslint-env node */
const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Data seeding array
const initialData = [
    // Tiffins
    { category: 'tiffins', name: 'Masala Dosa', price: 60, rating: 4.8, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80' },
    { category: 'tiffins', name: 'Idli Sambar', price: 40, rating: 4.6, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80' },
    { category: 'tiffins', name: 'Vada', price: 35, rating: 4.5, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
    { category: 'tiffins', name: 'Puri Bhaji', price: 50, rating: 4.4, img: 'https://images.unsplash.com/photo-1626200419109-31f8ae7480a4?auto=format&fit=crop&w=400&q=80' },
    { category: 'tiffins', name: 'Upma', price: 35, rating: 4.2, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
    { category: 'tiffins', name: 'Uttapam', price: 55, rating: 4.7, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80' },
    { category: 'tiffins', name: 'Poha', price: 30, rating: 4.3, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80' },
    // Meals
    { category: 'meals', name: 'South Indian Thali', price: 150, rating: 4.9, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
    { category: 'meals', name: 'North Indian Thali', price: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=400&q=80' },
    { category: 'meals', name: 'Veg Biryani', price: 120, rating: 4.6, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
    { category: 'meals', name: 'Chicken Biryani', price: 220, rating: 4.9, img: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=400&q=80' },
    { category: 'meals', name: 'Paneer Butter Masala', price: 160, rating: 4.7, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=400&q=80' },
    { category: 'meals', name: 'Mutton Curry', price: 280, rating: 4.8, img: 'https://images.unsplash.com/photo-1565557613262-b91c784ac5ff?auto=format&fit=crop&w=400&q=80' },
    { category: 'meals', name: 'Fish Curry Meal', price: 250, rating: 4.6, img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80' },
    // Starters 
    { category: 'starters', name: 'Paneer Tikka', price: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1599487405705-8eb0c50add98?auto=format&fit=crop&w=400&q=80' },
    { category: 'starters', name: 'Chicken 65', price: 200, rating: 4.7, img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80' },
    { category: 'starters', name: 'Chilli Prawns', price: 280, rating: 4.6, img: 'https://images.unsplash.com/photo-1565557613262-b91c784ac5ff?auto=format&fit=crop&w=400&q=80' },
    { category: 'starters', name: 'Veg Manchurian', price: 140, rating: 4.5, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80' },
    { category: 'starters', name: 'Gobi 65', price: 130, rating: 4.4, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80' },
    { category: 'starters', name: 'Mutton Kebabs', price: 300, rating: 4.9, img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80' },
    { category: 'starters', name: 'Spring Rolls', price: 120, rating: 4.3, img: 'https://images.unsplash.com/photo-1542382156909-924083701bea?auto=format&fit=crop&w=400&q=80' },
    // Drinks / Sweets
    { category: 'sweetDrinks', name: 'Mango Lassi', price: 80, rating: 4.8, img: 'https://images.unsplash.com/photo-1572490122747-3968b75f5b5b?auto=format&fit=crop&w=400&q=80' },
    { category: 'sweetDrinks', name: 'Gulab Jamun', price: 60, rating: 4.9, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80' },
    { category: 'sweetDrinks', name: 'Rasmalai', price: 90, rating: 4.8, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80' },
    { category: 'sweetDrinks', name: 'Cold Coffee', price: 110, rating: 4.6, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80' },
    { category: 'sweetDrinks', name: 'Lemon Soda', price: 50, rating: 4.5, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' },
    { category: 'sweetDrinks', name: 'Ice Cream Sundae', price: 140, rating: 4.7, img: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&w=400&q=80' },
    { category: 'sweetDrinks', name: 'Virgin Mojito', price: 120, rating: 4.6, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' },
].map((item, idx) => ({ ...item, id: `${item.category}-${idx}` }));


// Initialize Database (Only seeds if empty)
router.get('/seed', async (req, res) => {
    try {
        const count = await MenuItem.countDocuments();
        if (count === 0) {
            await MenuItem.insertMany(initialData);
            return res.json({ success: true, message: "Database seeded correctly!" });
        }
        res.json({ success: true, message: "Database already contains data!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET all menu items clustered by category exactly like initial data 
router.get('/', async (req, res) => {
    try {
        let items = await MenuItem.find({});

        // Auto-seed cloud database if empty on first load
        if (items.length === 0) {
            await MenuItem.insertMany(initialData);
            items = await MenuItem.find({});
        }

        // Convert flat array to grouped object
        const menuData = {
            tiffins: items.filter(i => i.category === 'tiffins'),
            meals: items.filter(i => i.category === 'meals'),
            starters: items.filter(i => i.category === 'starters'),
            sweetDrinks: items.filter(i => i.category === 'sweetDrinks')
        };

        res.json({ success: true, menuData });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        cb(null, 'item-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// POST a new menu item
router.post('/', upload.single('imageFile'), async (req, res) => {
    const { category, name, price, rating, img } = req.body;
    try {
        let finalImage = img;

        // If a file was uploaded by the user from file explorer, construct its public URL
        if (req.file) {
            finalImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        if (!category || !name || !price || !finalImage) {
            return res.status(400).json({ success: false, message: "Missing fields or image" });
        }

        const newItem = new MenuItem({
            id: `${category}-${Date.now()}`,
            category,
            name,
            price: Number(price),
            rating: Number(rating) || 5.0,
            img: finalImage
        });

        await newItem.save();
        res.status(201).json({ success: true, message: "Menu Item added!", item: newItem });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
