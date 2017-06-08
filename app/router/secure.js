const express = require('express');
var app = express();
const path = require('path');
const User = require('../model/User');

module.exports = function (router) {
    app = router ? router : app;

    app.use((req, res, next) => {
        if (!req.cookies.vitelogintoken) return res.redirect('/login');
        
        User.findByToken(req.cookies.vitelogintoken).then(user => {
            if (!user) return Promise.reject('No user found with that token');
            
            req.user = user;
            req.token = user.tokens.token;
            next();
        }).catch(err => {
            res.clearCookie('vitelogintoken').redirect('/login');
        });
    });

    app.get('/profile', (req, res) => {
        res.send(`<h1>Profile</h1><p>Hi ${req.user.name}! Welcome to your profile page!</p><div><a href="/auth/logout">Log Out</a></div>`);
    })
};