// Require packages
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

// App instance
let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
}

const app = express();

// Utilize EJS, body-parser, express
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

// Render homepage
app.get('', function(req, res) {
    res.render('index.ejs');
});

app.listen(port, () => {
    console.log("Started on port: " + port);
});
