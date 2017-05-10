const express = require('express');
const app = express();
const ejs = require('ejs');
const opn = require('opn');

app.set('view-engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/home.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/login.html');
});

app.listen(3000, () => { console.log('server runnning at port 3000'); opn('http://localhost:3000') });