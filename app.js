const express = require("express");
const dotenv = require("dotenv").config({path: './config/config.env'});;
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(
    process.env.mongodb,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (req, res) => {
        console.log("Connected to Database")
    }
)

const store = new MongoDBStore({
    uri: process.env.mongodb,
    collection: "Session",
});

app.use(
  session({
    secret: "1GzNg1Xp(3JV#3TC+0pgn^&r1>Lkh(Z2",
    name: 'userinfo',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { httpOnly: true}
  })
);

isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        console.log("Is Authenticated");
        next();
    } 
    else {
        req.session.error = "You have to Login first";
        res.redirect('/');
    }
}
console.log(isAuth);
app.get('/register', require('./route/routes').register);
app.use('/', require('./route/routes').login);
app.use('/GenerateReports', require('./route/routes').GenerateReports);
app.use('/logout', require('./route/routes').logout);
app.use('/dashboard', isAuth, require('./route/routes').dashboard);
app.use('/hrdashboard', isAuth, require('./route/routes').hrdashboard);
app.use('/SearchEmpbyusername',require('./route/routes').SearchEmpbyusername);
app.use('/SearchEmpbyEmail', require('./route/routes').SearchEmpbyEmail);
app.use('/add_emp', require('./route/routes').backend_router_addemp);

app.listen(3000, () => {
    console.log(`Listening to port: ${process.env.CPORT}`);
});