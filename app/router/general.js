const express = require('express');
var app = express();
const path = require('path');
const User = require('../model/User');

module.exports = function (router) {
    app = router ? router : app;

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../src/home.html'));
    });

    app.get('/login', authenticate, (req, res) => {
         res.sendFile(path.join(__dirname, '../../src/login.html'));
    });

    app.get('/register', authenticate, (req, res) => {
         res.sendFile(path.join(__dirname, '../../src/register.html'));
    });
};

function authenticate (req, res, next) {
    if (!req.cookies.vitelogintoken) return next();
    User.findByToken(req.cookies.vitelogintoken).then(user => {
        res.redirect('/user/profile');
    }).catch(err => next());
}