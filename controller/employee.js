const mongoose = require('mongoose');
const EMP = require('../model/employee.js');
const ATTENDANCE = require('../model/attendance.js');
const path = require('path');
const bcrypt = require('bcryptjs');

async function userlogin(req, res, next) {
    try
    {
        console.log("Searching");
        var query = { email: req.body.email };
        const emp = await EMP.findOne(query);
        if(!emp)
            return res.send("Email not found");
        const match = await bcrypt.compare(emp.password.toString(), req.body.password.toString());
        console.log(match);
        console.log(emp.password);
        console.log(req.body.password);
        if(emp.password != req.body.password)
            return res.send("Incorrect Password");
        console.log("Logged in Successfully, directing to dashboard");
        req.session.isAuth = true;
        req.session.email = emp.email;
        req.session.privilege = emp.privilege;
        let att = {
            id: emp._id,
            username: emp.username,
            email: emp.email,
            clockin: Date(),
            clockout: null,
            privilege: emp.privilege,
            active: true,
        };
        const attend = new ATTENDANCE(att);
        console.log("PRINTINGattendd");
        console.log(attend);
        req.session.attendance = attend;
        ClockIn(req, res);    
        
    }
    catch(err){
        console.log(err);
    }
}

async function ClockIn(req, res, next) {
    try {
        console.log(req.session.attendance);
        console.log("Saving Attendance");
        await ATTENDANCE.insertMany(req.session.attendance);
        console.log("Attendance Saved");
        console.log(req.session);
        if(req.session.privilege == "HR")
            return res.redirect('/hrdashboard');
        return res.redirect('/dashboard');
        //res.send(emp);     
    }
    catch(err){
        console.log(err);
    }
}

async function AddEmployee(req, res, next) {
    try {
        const emp = new EMP(req.body);
        console.log("pass before encrypt");
        console.log(req.body.password);
        //const hashpsw = await bcrypt.hash(req.body.password, 12);
        //emp.password = hashpsw;
        await EMP.insertMany(emp);
        res.sendFile(path.join(__dirname, '..', 'view/login.html'));     
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
}

async function GenerateReports(req, res, next) {
    const att = await ATTENDANCE.find();
    console.log(att);
    return res.send(att);
}

async function SearchEmpbyusername(req, res, next) {
    try
    {
        let empusername = req.params.usernamee;
        var query = { username: empusername };
        const emp = await EMPLOYEE.find(query);
        console.log(emp);
        if (emp != "")
        {
            res.send(emp);
        }
        if (emp == "")
            res.send("No Results Found");
    }
    catch(err){
        console.log(err);
    }
}

async function SearchEmpbyEmail(req, res, next) {
    try
    {
        let empemail = req.params.email;
        var query = { email: empemail };
        const emp = await EMPLOYEE.find(query);
        res.json(emp);
    }
    catch(err){
        console.log(err);
    }
}

async function userlogout(req, res, next) {
    try
    {
        req.session.attendance.clockout = new Date();
        req.session.attendance.active = false;
        ClockOut(req, res);
    }
    catch(err){
        console.log(err);
    }
}
async function ClockOut(req, res, next) {
    try {
        var query = { _id: req.session.attendance._id };
        await ATTENDANCE.updateOne(query, {$set: {clockout: req.session.attendance.clockout, 
        active: false}});
        console.log("Attendance Saved");
        //res.send(emp);     
        strdate = req.session.attendance.clockin;
        enddate = req.session.attendance.clockout;
        const hours = Math.abs(enddate.getHours() - strdate.getHours());
        const minutes = Math.abs(enddate.getMinutes() - strdate.getMinutes());
        const seconds = Math.abs(enddate.getSeconds() - strdate.getSeconds());
        req.session.isAuth = false;
        req.session.destroy((err) => {
            try{
                res.send(`<h1>Total time Spent HH:MM:SS : ${hours}:${minutes}:${seconds} </h1>`);
            }
            catch(err)
            {
                res.send("LoggedOut");
                console.log(err);
            }
          });
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    userlogin: userlogin,
    AddEmployee : AddEmployee,
    SearchEmpbyusername : SearchEmpbyusername,
    SearchEmpbyEmail : SearchEmpbyEmail,
    ClockIn: ClockIn,
    GenerateReports: GenerateReports,
    userlogout: userlogout,
    ClockOut: ClockOut,

};