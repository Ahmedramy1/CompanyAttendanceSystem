const express = require("express");
const dotenv = require("dotenv").config({path: './config/config.env'});;
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
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

app.use('/add_emp', require('./route/routes1').router);
app.use('/', require('./route/routes1').router);
app.use('/GenerateReports', require('./route/routes1').router);
app.use('/logout', require('./route/routes1').router);
app.use('/dashboard', require('./route/routes1').router);
app.use('/hrdashboard', require('./route/routes1').router);
app.use('/rem_employee', require('./route/routes1').router);
app.use('/search_emp', require('./route/routes1').router);

app.listen(3000, () => {
    console.log(`Listening to port: ${process.env.CPORT}`);
});