/* eslint-env node */
const mongoose = require('mongoose');

const uri1 = 'mongodb+srv://ammavanta-in:Rohith1234@ammavanta.xkvafik.mongodb.net/ammavanta?appName=AmmaVanta';

async function testConnection() {
    try {
        await mongoose.connect(uri1);
        console.log('Success encoded!');
        process.exit(0);
    } catch (err) {
        console.log('Encoded Error: ', err.message);
        process.exit(1);
    }
}
testConnection();
