const express = require('express');
var app = express();
const path = require('path');
const User = require('../model/User');

module.exports = function (router) {
    app = router ? router : app;

    app.post('/register', (req, res) => {
        const user = new User();
        const { name, email, password, username } = req.body;
        user.name = name;
        user.email = email;
        user.password = password;
        user.username = username;
        
        user.generateAuthToken().then(token => {
            res.cookie('vitelogintoken', token, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect('/');
        }).catch(err => res.send(err));
    });

    app.post('/login', (req, res) => {
        const { name, email, password } = req.body;

        User.findByCredentials({ email, password }).then(user => {
            if (!user) return Promise.reject('User not found');
            return user.generateAuthToken();
        }).then(token => {
            res.cookie('vitelogintoken', token, { maxAge: 1000 * 60 * 60 * 24 * 30 }).redirect('/');
        }).catch(err => res.send(err));
    });

    app.get('/logout', authenticate, (req, res) => {
        req.user.logout(req.token).then(() => res.redirect('/login')).catch(e => res.status(400).send(e));
    });
};

function authenticate (req, res, next) {
    if (!req.cookies.vitelogintoken) return res.redirect('/login');
    
    User.findByToken(req.cookies.vitelogintoken).then(user => {
        if (!user) return Promise.reject('No user found with that token');
        
        req.user = user;
        req.token = user.tokens.token;
        next();
    }).catch(err => {
        res.clearCookie('vitelogintoken').redirect('/login');
    });
}