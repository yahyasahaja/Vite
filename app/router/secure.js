const express = require('express');
var app = express();
const path = require('path');
const User = require('../model/User');
const allViteIdData = [ 'wedding', '']

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

    app.get('/new/wedding', (req, res) => {
        res.sendFile(path.join(__dirname, '../../src/wedding.html'));
    });

    app.get('/edit/wedding', (req, res) => {
        var { vitelist } = req.user;
        var wedding = vitelist.invitation.wedding;
        if (!req.query.link) return res.redirect('/user/vitelist');

        for (var i = 0; i < wedding.length; i++) {
            if (wedding[i].link == req.query.link) {
                res.sendFile(path.join(__dirname, '../../src/wedding.html'));
                return;
            }
        }

        res.redirect('/user/vitelist');
    });

    app.get('/profile', (req, res) => {
        res.send(`<h1>Profile</h1><p>Hi ${req.user.name}! Welcome to your profile page!</p><div><a href="/auth/logout">Log Out</a></div>`);
    });

    app.get('/vitelist', (req, res) => {
        res.sendFile(path.join(__dirname, '../../src/vitelist.html'));
    });
};