const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');

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

router.get('/register', (req, res) => {
    res.render('register', {
        title: "Рестрація"
    });
});

router.post('/register', parser, (req, res) => {
    console.log(req.body);
});

module.exports = router;