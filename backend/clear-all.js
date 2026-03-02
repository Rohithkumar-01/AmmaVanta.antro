/* eslint-env node */
const mongoose = require('mongoose');
require('dotenv').config();
const MenuItem = require('./models/MenuItem');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const count = await MenuItem.countDocuments({});
    await MenuItem.deleteMany({});
    console.log(`Successfully deleted ${count} menu items from the database.`);
    process.exit(0);
}).catch(err => {
    console.error("Failed to clear database:", err);
    process.exit(1);
});
