const express = require('express');
const app = express();
const ejs = require('ejs');
const opn = require('opn');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { url } = require('./config/database');

mongoose.Promise = global.Promise;
mongoose.connect(url);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing
app.use(cookieParser());

app.set('view-engine', 'ejs');

app.use(express.static('./public'));

const secure = express.Router();
const auth = express.Router();
const api = express.Router();
require('./app/router/general.js')(app);
require('./app/router/secure.js')(secure);
require('./app/router/auth.js')(auth);
require('./app/router/api.js')(api);

app.use('/user', secure);
app.use('/auth', auth);
app.use('/api', api);

app.get('/coba', (req, res) => {
    res.sendFile(__dirname + '/src/coba.html');
});

app.get('/coba2', (req, res) => {
    res.send(`<h1>${req.header('Host')} ${req.header('aaa')}</h1>`);
});

app.listen(port, () => { console.log(`server runnning at port ${port}`); opn('http://localhost:3000') });