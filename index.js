const express = require("express");
const path = require('path');
const exphbs = require("express-handlebars");
const session = require('express-session');
const router = require('./routers/main');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');

const MONGO_PASSWORD = process.env.password || "school3if";
const MONGO_SECRET = process.env.secret || "secretmongoosetoken"

const app = express();
const PORT = 3000;

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

var store = new MongoDBStore({
    uri: 'mongodb+srv://restro:' + MONGO_PASSWORD + '@restro-ibylf.mongodb.net/test',
    databaseName: "restro",
    collection: "sessions"
});

const parser = bodyParser.urlencoded({ extended: false });

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: MONGO_SECRET,
    cookie: {
        maxAge: 3600*24*5*1000
    },
    store: store,
    resave: true,
    saveUninitialized: false
}));
app.use(router);

serverStart();

async function serverStart(){
    try{
        await mongoose.connect('mongodb+srv://restro:' + MONGO_PASSWORD + '@restro-ibylf.mongodb.net/test', {
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