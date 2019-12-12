const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

router.get('/', async (req, res) => {
    if(req.session.logged){
        var data = await getUserData(req.session.username, req.session.password);
        if(data.length > 0) return res.render('index', {
                title: "Головна",
                username: data[0].username,
                role: data[0].role
            });
        else req.session.destroy();
    }
    res.render('index', {
        title: "Головна",
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => { res.redirect('/') });
});

async function getUserData(login, password){
    var data = [];
    await User.find({username: login, password: password}, (err, res) => {
        if(err) throw err;
        data = res;
    });
    return data;
}

module.exports = router;