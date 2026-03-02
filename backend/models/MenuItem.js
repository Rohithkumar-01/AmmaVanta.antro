/* eslint-env node */
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true, enum: ['tiffins', 'meals', 'starters', 'sweetDrinks'] },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 5.0 },
    img: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
