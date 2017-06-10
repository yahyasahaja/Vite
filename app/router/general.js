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

    app.get('/view/:username/:link', (req, res) => {
        const { username, link } = req.params;
        
        User.findOne({ $or: [ 
            { 'vitelist.greetings.christmas.link': link }, 
            { 'vitelist.invitation.wedding.link': link }
        ]}).then(user => {
            var { christmas } = user.vitelist.greetings;
            var { wedding } = user.vitelist.invitation;

            for (var i in christmas)  if (christmas[i].link == link) 
            return res.render('wedding.ejs', { data: christmas[i] });
            
            for (var i in wedding)  if (wedding[i].link == link) 
            return res.render('wedding.ejs', { data: wedding[i] });

            return Promise.reject('not found');
        }).catch(e => {
            res.send(e);
        });
    });
};

function authenticate (req, res, next) {
    if (!req.cookies.vitelogintoken) return next();
    User.findByToken(req.cookies.vitelogintoken).then(user => {
        res.redirect('/user/profile');
    }).catch(err => next());
}