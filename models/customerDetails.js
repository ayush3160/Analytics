const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    cust_name:{
        type: String,
        required: true,
    },
    wa_number: {
        type: Number,
        required: true
    },
    site_id:{
        type: Number,
        required: true,
    },
    uuid:{
        type: String,
        required: true
    }
    
},
    { timestamps: true }
);

module.exports = mongoose.model('customerDetails', CustomerSchema);