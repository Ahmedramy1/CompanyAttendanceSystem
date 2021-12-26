const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require("path");
const app = express();
dotenv.config({path: './config/config.env'});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./view/', {index: 'login.html'}));
//app.get('/', (req, res) => {
//    res.send("fwaf");
//})


mongoose.connect(
    process.env.mongodb,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (req, res) => {
        console.log("Connected to Database")
    }
)

app.use('/', require('./route/routes').login);
app.use('/SearchEmpbyusername', require('./route/routes').SearchEmpbyusername);
app.use('/SearchEmpbyEmail', require('./route/routes').SearchEmpbyEmail);
app.use('/add_emp', require('./route/routes').backend_router_addemp);
app.use('/logout', require('./route/routes').logout);


//start = 'Sun Dec 26 2021 04:42:57 GMT+0200 (Eastern European Standard Time)';
//end   = 'Sun Dec 26 2021 09:01:13 GMT+0200 (Eastern European Standard Time)';
//hours = Math.abs(parseInt(end.toString().substring(16, 18)) - parseInt(start.toString().substring(16, 18)));
//minutes = Math.abs(parseInt(end.toString().substring(19, 21)) - parseInt(start.toString().substring(19, 21)));
//seconds = Math.abs(parseInt(end.toString().substring(22, 24)) - parseInt(start.toString().substring(22, 24)));
//console.log(`Time Spent: ${hours} Hours: ${minutes} minutes: ${seconds} seconds:`);

app.listen(3000, () => {
    console.log(`Listening to port: ${process.env.CPORT}`);
});