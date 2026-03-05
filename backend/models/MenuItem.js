/* eslint-env node */
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true, enum: ['tiffins', 'meals', 'starters', 'sweetDrinks'] },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 5.0 },
    img: { type: String, required: true },
    prepTime: { type: String, default: "15 - 20 minutes" },
    ingredients: { type: String, default: "Farm-fresh ingredients and premium spices." },
    preparation: { type: String, default: "Cooked to perfection using traditional home-style techniques." }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
