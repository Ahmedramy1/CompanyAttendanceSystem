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
const aaport = process.env.PORT || 3000;
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
    cookie: { httpOnly: true, maxAge: (12 * 3600000)} //(12 * 3600000) maxAge: to destroy the session after 12 hours
  })
);


app.use('/', require('./route/routes1').router);
app.use('/logout', require('./route/routes1').router);
app.use('/register', require('./route/routes1').router);
//Employee
app.use('/dashboard', require('./route/routes1').router);
app.use('/viewmyreqs', require('./route/routes1').router);
app.use('/REQUEST', require('./route/routes1').router);
// HR
app.use('/hrdashboard', require('./route/routes1').router);
app.use('/GenerateReports', require('./route/routes1').router);
app.use('/rem_employee', require('./route/routes1').router);
app.use('/search_emp', require('./route/routes1').router);
app.use('/respondtorequest', require('./route/routes1').router);
app.use('/viewreqs', require('./route/routes1').router);


app.listen(aaport, () => {
    console.log(`Listening to port: ${aaport}`);
});