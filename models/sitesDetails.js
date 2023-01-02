const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
    name: String,
    siteUrl: {
        type: String,
        unique: true
    },
    siteId: Number
},
    { timestamps: true },
    
);

module.exports = mongoose.model('siteDetails', SiteSchema);