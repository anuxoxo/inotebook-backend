const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://localhost:27017/inotebook', () => {
        console.log("Connected to mongoose successfully!");
    });
}

module.exports = main;