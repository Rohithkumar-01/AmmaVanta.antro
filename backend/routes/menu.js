/* eslint-env node */
const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Data seeding array
const initialData = [
    // Tiffins
    {
        category: 'tiffins', name: 'Masala Dosa', price: 60, rating: 4.8, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80',
        prepTime: "10 - 15 minutes", ingredients: "Fermented rice & lentil batter, spiced potato filling, ghee, mustard seeds.", preparation: "Crispy crepe wrapped around a hot, savory spiced potato mash. Served with fresh coconut chutney and hot sambar."
    },
    {
        category: 'tiffins', name: 'Idli Sambar', price: 40, rating: 4.6, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80',
        prepTime: "5 - 10 minutes", ingredients: "Steamed rice & urad dal cakes, lentil stew, mixed vegetables, tamarind.", preparation: "Soft, fluffy steamed cakes served alongside a tangy and spicy lentil-vegetable stew."
    },
    {
        category: 'tiffins', name: 'Vada', price: 35, rating: 4.5, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
        prepTime: "10 - 15 minutes", ingredients: "Urad dal paste, green chilies, curry leaves, ginger, black pepper.", preparation: "Deep-fried savory doughnut-shaped fritters, crispy on the outside and soft inside."
    },
    {
        category: 'tiffins', name: 'Puri Bhaji', price: 50, rating: 4.4, img: 'https://images.unsplash.com/photo-1626200419109-31f8ae7480a4?auto=format&fit=crop&w=400&q=80',
        prepTime: "10 - 15 minutes", ingredients: "Whole wheat dough, boiled potatoes, tomatoes, turmeric, green chilies.", preparation: "Deep-fried puffed bread served with a flavorful, rich, and mildly spiced potato curry."
    },
    {
        category: 'tiffins', name: 'Upma', price: 35, rating: 4.2, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
        prepTime: "10 - 12 minutes", ingredients: "Roasted semolina, onions, green peas, mustard seeds, curry leaves.", preparation: "Dry-roasted semolina cooked into a savory, thick porridge tempered with aromatic spices."
    },
    {
        category: 'tiffins', name: 'Uttapam', price: 55, rating: 4.7, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80',
        prepTime: "12 - 15 minutes", ingredients: "Thick fermented batter, finely chopped tomatoes, onions, cilantro, green chilies.", preparation: "A thick, soft pancake-like dosa loaded with fresh, crunchy toppings roasted to perfection."
    },
    {
        category: 'tiffins', name: 'Poha', price: 30, rating: 4.3, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80',
        prepTime: "8 - 10 minutes", ingredients: "Flattened rice flakes, peanuts, onions, turmeric, fresh coriander.", preparation: "Light and healthy flattened rice stir-fried with turmeric, onions, and crunchy peanuts."
    },

    // Meals
    {
        category: 'meals', name: 'South Indian Thali', price: 150, rating: 4.9, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
        prepTime: "5 - 10 minutes", ingredients: "Steamed rice, dal, rasam, 2 veg curries, curd, papad, pickle.", preparation: "A wholesome traditional platter featuring a balanced mix of spicy, savory, and soothing dishes."
    },
    {
        category: 'meals', name: 'North Indian Thali', price: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=400&q=80',
        prepTime: "10 - 15 minutes", ingredients: "Roti/Naan, Paneer Butter Masala, Dal Makhani, Jeera Rice, Raita.", preparation: "A rich, grand feast of North Indian delicacies showcasing creamy gravies and fresh breads."
    },
    {
        category: 'meals', name: 'Veg Biryani', price: 120, rating: 4.6, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
        prepTime: "20 - 25 minutes", ingredients: "Basmati rice, mixed vegetable chunks, biryani masala, saffron, mint.", preparation: "Fragrant long-grain rice slow-cooked with spiced vegetables and aromatic herbs in a sealed pot."
    },
    {
        category: 'meals', name: 'Chicken Biryani', price: 220, rating: 4.9, img: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=400&q=80',
        prepTime: "25 - 30 minutes", ingredients: "Basmati rice, marinated chicken, yogurt, whole spices, fried onions.", preparation: "Authentic Dum Biryani, layering heavily marinated meat and partially cooked rice under a tight seal."
    },
    {
        category: 'meals', name: 'Paneer Butter Masala', price: 160, rating: 4.7, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=400&q=80',
        prepTime: "15 - 20 minutes", ingredients: "Cottage cheese cubes, tomatoes, cashews, butter, fresh cream.", preparation: "Soft paneer cubes simmered in a luscious, sweet, and slightly spicy tomato-cashew gravy."
    },
    {
        category: 'meals', name: 'Mutton Curry', price: 280, rating: 4.8, img: 'https://images.unsplash.com/photo-1565557613262-b91c784ac5ff?auto=format&fit=crop&w=400&q=80',
        prepTime: "30 - 35 minutes", ingredients: "Tender mutton pieces, caramelized onions, tomatoes, ginger-garlic paste, meat masala.", preparation: "Rich, slow-cooked meat stew where the mutton absorbs the fiery blend of roasted spices."
    },
    {
        category: 'meals', name: 'Fish Curry Meal', price: 250, rating: 4.6, img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80',
        prepTime: "20 - 25 minutes", ingredients: "Fresh regional fish, tamarind extract, coconut milk, curry leaves, red chili powder.", preparation: "A tangy and spicy coastal-style fish curry served over a bed of warm steamed rice."
    },

    // Starters 
    {
        category: 'starters', name: 'Paneer Tikka', price: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1599487405705-8eb0c50add98?auto=format&fit=crop&w=400&q=80',
        prepTime: "15 - 20 minutes", ingredients: "Paneer, bell peppers, onions, yogurt marinade, tandoori masala.", preparation: "Chunks of paneer marinated in spiced yogurt, skewered, and charred to smoky perfection in a tandoor."
    },
    {
        category: 'starters', name: 'Chicken 65', price: 200, rating: 4.7, img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80',
        prepTime: "15 - 20 minutes", ingredients: "Boneless chicken, red chilies, curry leaves, garlic, rice flour.", preparation: "Spicy, deep-fried chicken bites coated with a fiery, iconic red sauce and crispy curry leaves."
    },
    {
        category: 'starters', name: 'Chilli Prawns', price: 280, rating: 4.6, img: 'https://images.unsplash.com/photo-1565557613262-b91c784ac5ff?auto=format&fit=crop&w=400&q=80',
        prepTime: "12 - 15 minutes", ingredients: "Fresh prawns, soy sauce, green chilies, bell peppers, spring onions.", preparation: "Juicy prawns stir-fried in a hot and sweet dark soy glaze with crunchy veggies."
    },
    {
        category: 'starters', name: 'Veg Manchurian', price: 140, rating: 4.5, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
        prepTime: "15 - 20 minutes", ingredients: "Grated cabbage, carrots, soy sauce, garlic, ginger, cornstarch.", preparation: "Fried vegetable dumplings tossed in a savory, umami-rich sticky soy and garlic sauce."
    },
    {
        category: 'starters', name: 'Gobi 65', price: 130, rating: 4.4, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
        prepTime: "15 - 18 minutes", ingredients: "Cauliflower florets, Kashmiri chili powder, garlic paste, rice flour.", preparation: "Crispy, deep-fried cauliflower tossed with a spicy, tangy dry coating."
    },
    {
        category: 'starters', name: 'Mutton Kebabs', price: 300, rating: 4.9, img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80',
        prepTime: "20 - 25 minutes", ingredients: "Minced mutton, roasted gram flour, mint leaves, green chilies, garam masala.", preparation: "Highly spiced minced meat shaped onto skewers and grilled directly over hot coals."
    },
    {
        category: 'starters', name: 'Spring Rolls', price: 120, rating: 4.3, img: 'https://images.unsplash.com/photo-1542382156909-924083701bea?auto=format&fit=crop&w=400&q=80',
        prepTime: "10 - 15 minutes", ingredients: "Thin pastry sheets, julienne vegetables, glass noodles, soy sauce.", preparation: "Crispy fried rolls filled with a hot, savory, and delicately crunchy vegetable mix."
    },

    // Drinks / Sweets
    {
        category: 'sweetDrinks', name: 'Mango Lassi', price: 80, rating: 4.8, img: 'https://images.unsplash.com/photo-1572490122747-3968b75f5b5b?auto=format&fit=crop&w=400&q=80',
        prepTime: "5 minutes", ingredients: "Fresh mango pulp, chilled yogurt, sugar, cardamom, pistachio topping.", preparation: "Blended into a thick, creamy, sweet yogurt drink served chilled."
    },
    {
        category: 'sweetDrinks', name: 'Gulab Jamun', price: 60, rating: 4.9, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80',
        prepTime: "5 minutes", ingredients: "Khoya (milk solids), sugar syrup, rose water, cardamom powder.", preparation: "Soft, deep-fried milk dumplings soaked overnight in a warm, fragrant sugar syrup."
    },
    {
        category: 'sweetDrinks', name: 'Rasmalai', price: 90, rating: 4.8, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80',
        prepTime: "5 - 10 minutes", ingredients: "Chenna (cottage cheese), thickened milk, saffron strands, chopped almonds.", preparation: "Spongy cottage cheese discs simmering in sweetened, saffron-infused thickened milk."
    },
    {
        category: 'sweetDrinks', name: 'Cold Coffee', price: 110, rating: 4.6, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80',
        prepTime: "5 minutes", ingredients: "Coffee decoction, cold milk, sugar, vanilla ice cream scoop, chocolate syrup.", preparation: "Frothy, blended iced coffee topped with rich vanilla ice cream and chocolate drizzle."
    },
    {
        category: 'sweetDrinks', name: 'Lemon Soda', price: 50, rating: 4.5, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
        prepTime: "5 minutes", ingredients: "Fresh lemon juice, sparkling water, sugar syrup, mint leaves, chaat masala.", preparation: "A fizzy and refreshing citrus drink with a distinct sweet and tangy punch."
    },
    {
        category: 'sweetDrinks', name: 'Ice Cream Sundae', price: 140, rating: 4.7, img: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&w=400&q=80',
        prepTime: "5 - 8 minutes", ingredients: "Multi-flavor ice cream scopes, chocolate fudge, nuts, cherry, whipped cream.", preparation: "A gorgeous dessert tower layered with syrups, toppings, and clouds of whipped cream."
    },
    {
        category: 'sweetDrinks', name: 'Virgin Mojito', price: 120, rating: 4.6, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
        prepTime: "5 minutes", ingredients: "Muddled mint, lime wedges, sprite/soda, crushed ice.", preparation: "A vibrant, non-alcoholic cooler bursting with fresh minty and zesty lime flavors."
    },
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

// Store in memory instead of disk for serverless/ephemeral environments
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST a new menu item
router.post('/', upload.single('imageFile'), async (req, res) => {
    const { category, name, price, rating, img } = req.body;
    try {
        let finalImage = img;

        // If a file was uploaded by the user from file explorer, convert to Base64
        // This solves the ephemeral filesystem issue on platforms like Render where local uploads get deleted on restart
        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            finalImage = `data:${req.file.mimetype};base64,${base64Image}`;
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
            img: finalImage,
            prepTime: req.body.prepTime || "15 - 20 minutes",
            ingredients: req.body.ingredients || "Farm-fresh ingredients and premium spices.",
            preparation: req.body.preparation || "Cooked to perfection using traditional home-style techniques."
        });

        await newItem.save();
        res.status(201).json({ success: true, message: "Menu Item added!", item: newItem });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT update a menu item price
router.put('/:id', async (req, res) => {
    try {
        const { price } = req.body;
        if (!price || isNaN(Number(price))) {
            return res.status(400).json({ success: false, message: "Valid price is required" });
        }

        const updatedItem = await MenuItem.findOneAndUpdate(
            { id: req.params.id },
            { $set: { price: Number(price) } },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.json({ success: true, message: "Price updated successfully", item: updatedItem });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE a menu item
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await MenuItem.findOneAndDelete({ id: req.params.id });
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        res.json({ success: true, message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
