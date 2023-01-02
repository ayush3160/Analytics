//load env variables
if(process.env.NODE_ENV != 'production'){
    require("dotenv").config(); //for using environment variables
}

require("./config/database").connect(); //Setting up the database connection

const express = require("express");
const app = express();

var bodyParser = require('body-parser') //for reading json from form data
const cors = require("cors"); //for enabling api requuest from external source

const port = process.env.PORT;

//cros
app.use(cors());

//bodyparser
app.use(bodyParser.urlencoded({
    extended: false
  }));


app.use(bodyParser.json());
app.use(bodyParser.text());

//routes decalre
const site = require("./routes/sites");
const track = require("./routes/track");
const customer = require("./routes/customer");

//routing
app.get("/", (req, res) => {
    res.json({ hello : "world"});
});


//sites routing
app.use("/sites", site);
app.use("/track", track);
app.use("/customer", customer);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;