const mongoose = require('mongoose');
require('dotenv').config();
const MenuItem = require('./models/MenuItem');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    // Delete all items that do not start with http or have an undefined image
    await MenuItem.deleteMany({
        $or: [
            { img: { $not: /^http/ } },
            { img: null }
        ]
    });
    console.log("Deleted invalid items.");
    process.exit(0);
});
