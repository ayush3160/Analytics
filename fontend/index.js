const express = require("express");
const app = express();
const path = require('path')

app.use('/', express.static(path.join(__dirname, './')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './dashboard-analytics.html'));
});

app.listen(3006, () => {
    console.log(`Server is running on port 3006`);
});