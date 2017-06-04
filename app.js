const express = require('express');
const app = express();
const ejs = require('ejs');
const opn = require('opn');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing

app.set('view-engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/home.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/src/register.html');
});

app.post('/register', (req, res) => {
    res.json(req.body);
})

app.listen(port, () => { console.log(`server runnning at port ${port}`); opn('http://localhost:3000') });