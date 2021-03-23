// Require packages
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http')
const io = require('socket.io')(http);
const mongoose = require('mongoose');

// App instance
let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
}

const app = express();
http.Server(app);

// Utilize EJS, body-parser, express
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

// Database
const dbURI = process.env.MONGODB_URI;
mongoose.connect(
    dbURI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => { if (err) {console.log("mongoDB connection", err); }}
);
const Message = mongoose.model('message', {
    name: String,
    message: String
});

// 
io.on('connection', socket => {
    console.log('a user has been connected');
});


// Render homepage
app.get('', function(req, res) {
    res.render('index.ejs');
});

app.route('/messages')

    .get( (req, res) => {
        Message.find({}, (err, messages) => {
            res.send(messages);
        });
    })

    .post( async (req, res) => {
        try {
            let message = new Message(req.body);
            let savedMessage = await message.save();
            console.log('saved');
            let censored = await Message.findOne({ message: 'badword'});

            if (censored) await Message.remove({_id: censored.id});
            else io.emit('message', req.body);
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(500);
            return console.error(error);
        } finally {
            console.log("message post called");
        }
    }
);

app.listen(port, () => {
    console.log("Started on port: " + port);
});
