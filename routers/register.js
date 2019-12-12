const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

router.get('/register', (req, res) => {
    if(req.session.logged){
        var data = getUserData(req.session.login, req.session.password);
        if(data.length > 0) return res.redirect('/');
        else req.session.destroy();
    }
    res.render('register', {
        title: "Рестрація",
        error: false
    });
});

router.post('/register', parser, (req, res) => {
    if(req.body.username && req.body.password && req.body.password_again){
        if(req.body.password.length < 8 || req.body.password.length > 32) return res.render('register', {
            title: "Реєстрація",
            error: "Пароль має містити від 8 до 32 символів."
        });
        if(req.body.password !== req.body.password_again) return res.render('register', {
            title: "Реєстрація",
            error: "Введені паролі не співпадають."
        });
        User.find({username: req.body.username}, (err, rows) => {
            if(err) throw err;
            if(rows.length > 0) return res.render('register', {
                    title: "Реєстрація",
                    error: "Користувач з таким логіном вже зареєстрований."
                });
            let crypted_password = sha256(req.body.password);
            let user = new User({username: req.body.username, role: 0, password: crypted_password});
            user.save(err => {
                if(err) throw err;
                res.render('register', {
                    title: "Реєстрація",
                    success: "Реєстрація успішно завершена. Перейдіть на сторінку <i>Вхід</i> для авторизації."
                })
            });
        })
    }else{
        res.render('register', {
            title: "Реєстрація",
            error: "Ви не заповнили всі поля форми."
        });
    }
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