const mongoose = require('mongoose');

const SiteCountSchema = new mongoose.Schema({
    id:{
        type:  String
    },
    seq:{
        type: Number
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('siteCountDetails', SiteCountSchema);