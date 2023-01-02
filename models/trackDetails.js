const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    page_url: String,
    page_name: String,
    total_time_stayed: String,
    location: String,
    timezone: String,
    lat: String,
    longi: String,
    uuid: String,
    device_type: String,
    browser_name: String,
    button_clicked:{
        flag: Boolean,
        button_name: String
    },
    date_created: Date
}
);

module.exports = mongoose.model('Tracks', trackSchema);