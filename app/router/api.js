const express = require('express');
var app = express();
const path = require('path');
const User = require('../model/User');

module.exports = function (router) {
    app = router ? router : app;

    app.get('/userdata', authenticate, (req, res) => {
        var { name, username, email } = req.user;
        res.json({ name, username, email });
    });

    app.get('/vitelist', authenticate, (req, res) => {
        res.json(req.user.vitelist);
    });

    app.post('/newvite', authenticate, (req, res) => {
        var { linksource, type, subtype, link, groom, bride, name, location, date } = req.body;
        var exist;

        try {
            var data = req.user.vitelist[type][subtype];
            for (var i = 0; i < data.length; i++) {
                if (linksource != link && data[i].link == link) throw new Error('Link already exist');
                if (data[i].link == link) {
                    data[i] = { link, groom, bride, name, location, date };
                    exist = true;
                    break;
                }
            }
            
            if (!exist) data.push({ link, groom, bride, name, location, date });
            req.user.save().then(() => {
                res.redirect(`/user/edit/${subtype}?link=${link}`);
            }).catch(e => res.send(e));
        } catch (e) {
            res.send(e.message);
        }
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