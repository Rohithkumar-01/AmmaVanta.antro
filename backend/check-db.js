const mongoose = require('mongoose');
require('dotenv').config();
const MenuItem = require('./models/MenuItem');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const items = await MenuItem.find().sort({ createdAt: -1 }).limit(3);
    console.log(items.map(i => ({ name: i.name, img: i.img })));
    process.exit(0);
});
