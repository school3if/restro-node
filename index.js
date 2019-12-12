const express = require("express");
const path = require('path');
const exphbs = require("express-handlebars");
const session = require('express-session');
const routers = new Array();
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const cfg = require('./config.json');

routers[0] = require('./routers/main');
routers[1] = require('./routers/register');
routers[2] = require('./routers/login');

const MONGO_PASSWORD = process.env.password || cfg.password;
const MONGO_SECRET = process.env.secret || cfg.secret;

const app = express();
const PORT = 3000;

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

var store = new MongoDBStore({
    uri: 'mongodb+srv://restro:' + MONGO_PASSWORD + '@restro-tygzx.mongodb.net/restro',
    databaseName: "restro",
    collection: "sessions"
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: MONGO_SECRET,
    cookie: {
        maxAge: 3600*24*365*1000
    },
    store: store,
    resave: true,
    saveUninitialized: false
}));

app.use(routers[0]);
app.use(routers[1]);
app.use(routers[2]);

serverStart();

async function serverStart(){
    try{
        await mongoose.connect('mongodb+srv://restro:' + MONGO_PASSWORD + '@restro-tygzx.mongodb.net/restro', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        app.listen(PORT);
        console.log("Server started on port " + PORT);
    }catch(error){
        console.log(error);
    }
}