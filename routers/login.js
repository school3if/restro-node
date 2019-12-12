const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

router.get('/login', (req, res) => {
    if(req.session.logged){
        var data = getUserData(req.session.login, req.session.password);
        if(data.length > 0) return res.redirect('/');
        else req.session.destroy();
    }
    res.render('login', {
        title: "Вхід",
    });
});

router.post('/login', parser, (req, res) => {
    if(req.body.username && req.body.password){
        var crypted_password = sha256(req.body.password);
        User.find({username: req.body.username}, (err, result) => {
            if(err) throw err;
            if(result.length < 1) return res.render('login', {
                title: "Авторизація",
                error: "Користувач з таким логіном не зареєстрований."
            }); 
            if(result[0].password !== crypted_password) return res.render('login', {
                title: "Авторизація",
                error: "Ви ввели неправильний пароль."
            });
            req.session.logged = true;
            req.session.username = req.body.username;
            req.session.password = crypted_password;
            res.redirect('/');
        });
    }else return res.render('login', {
        title: "Авторизація",
        error: "Ви не заповнили всі поля форми."
    })
});

async function getUserData(login, password){
    var data = false;
    await User.find({username: login, password: password}, (err, res) => {
        if(err) throw err;
        if(res.length > 0) data = res;
    });
    return data;
}

module.exports = router;