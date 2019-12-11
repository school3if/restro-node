const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    res.render('index', {
        title: "Головна"
    });
});

router.get('/login', (req, res) => {
    res.render('login', {
        title: "Вхід"
    });
});

router.post('/login', parser, (req, res) => {
    if(req.body.username && req.body.password){
        var ctypted_password = sha256(req.body.password);
        //тут код авторизації
    }else return res.render('login', {
        title: "Авторизація",
        error: "Ви не заповнили всі поля форми."
    })
});

//register routes

router.get('/register', (req, res) => {
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

module.exports = router;