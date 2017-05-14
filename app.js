const express = require('express');
const app = express();
const ejs = require('ejs');
const opn = require('opn');
const port = process.env.PORT || 3000;

var a = { "aa":"a", "bb":"b", "cc":"c"};

app.set('view-engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/home.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/login.html');
});

app.listen(port, () => { console.log(`server runnning at port ${port}`); opn('http://localhost:3000') });

// var a = { a: "1", b: "2"};
// Object.keys(a).map((a) => console.log(a));