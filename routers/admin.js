const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const userActions = require('../controllers/user');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

router.get('/admin', async (req, res) => {
    if(req.session.logged){
        let data = await userActions.getUserData(req.session.username, req.session.password);
        console.log(data);
        if(data.length > 0){
            if(data[0].role < 1) return res.redirect('/');
            res.render('admin', {
                title: "Панель керування",
                role: data[0].role,
                username: req.session.username
            });
        }else return req.session.destroy(() => { res.redirect('/') });
    }else res.redirect('/');
});

router.get('/admin/newdish', async (req, res) => {
    if(req.session.logged){
        let data = await userActions.getUserData(req.session.username, req.session.password);
        console.log(data);
        if(data.length > 0){
            if(data[0].role < 1) return res.redirect('/');
            res.render('admin', {
                title: "Панель керування",
                role: data[0].role,
                username: req.session.username
            });
        }else return req.session.destroy(() => { res.redirect('/') });
    }else res.redirect('/');
});

module.exports = router;