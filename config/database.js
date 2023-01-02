const mongoose = require('mongoose');//moongose

const { MONGODB_URI } = process.env;
//configure mongoose
exports.connect = () => {
    mongoose.connect(MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, (err) => {
            if (err) {
                console.log(err);
                process.exit(1);
            } else {
                console.log("Connected to MongoDB");
            }
        });
    mongoose.set('debug', true);
};