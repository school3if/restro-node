const {Router} = require('express');
const router = Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

const User = require('../models/user');
const Dish = require('../models/dish');
const Menu = require('../models/menu');

router.get('/', async (req, res) => {
    const menu = await getDishes();
    if(req.session.logged){
        var data = await getUserData(req.session.username, req.session.password);
        if(data.length > 0) return res.render('index', {
                title: "Головна",
                menu,
                username: data[0].username,
                role: data[0].role
            });
        else req.session.destroy();
    }
    res.render('index', {
        title: "Головна",
        menu,
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

async function getDishes() {
    const menu = await getMenu();
    if (menu !== null) {
        return await Dish.find({
            '_id': { $in: menu.menu}
        }, function(err, res) {
            return res
        });
    } else return null;
}

async function getMenu(date = new Date()) {
    let nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return await Menu.findOne({
        "date": {
            "$gte": date, 
            "$lt": nextDay
        }},
        (err, res) => {
            if(err) throw err;
            return res;
        }
    )
}

module.exports = router;