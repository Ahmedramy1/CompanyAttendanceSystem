const mongoose = require('mongoose');
const {EMP, HR} = require('../model/employee.js');
const {ATTENDANCE} = require('../model/attendance.js');
const path = require('path');

async function userlogin(req, res, next) {
    try
    {
        console.log("Searching");
        let empemail = req.body.email;
        var query = { email: empemail };
        const emp = await EMP.findOne(query);
        console.log(`Entered Email: ${empemail}\nReal    Email: ${emp.email}`);
        console.log(`Entered Password: ${req.body.password}\nReal    Password: ${emp.password}`);
        if(emp.password == req.body.password)
        {
            console.log("Logged in Successfully");
            res.sendFile(path.join(__dirname, '..', 'view/emphomepage.html'));
            //console.log(emp);
            //res.json(emp);
            let att = {
                id: emp._id,
                username: emp.username,
                email: emp.email,
                clockin: Date(),
                clouckout: "00",
                privilege: emp.privilege
            };
            const attend = new ATTENDANCE(att);
            console.log("attendd");
            console.log(attend);
            ClockIn(attend);
        }
        else
        {
            res.send("Incorrect Password");
        }
    }
    catch(err){
        console.log(err);
    }
}

async function ClockIn(req, res, next) {
    try {
        console.log(req);
        console.log("Saving Attendance");
        await ATTENDANCE.insertMany(req);
        console.log("Attendance Saved");
        //res.send(emp);     
    }
    catch(err){
        console.log(err);
    }
}

async function AddEmployee(req, res, next) {
    try {
        console.log(req.body);
        const emp = new EMP(req.body);
        console.log("Saving");
        if(req.body.privilege == "Employee")
            await EMP.insertMany(emp);
        else if(req.body.privilege == "HR")
            await HR.insertMany(emp);
        console.log("Saved");
        res.sendFile(path.join(__dirname, '..', 'view/login.html'));
        //res.send(emp);       
    }
    catch(err){
        console.log("ERRORRR");
        console.log(err);
        res.send({err: err});
    }
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

/*
###############################################
###############################################
###############################################
###############################################
###############################################
###############################################
*/
async function userlogout(req, res, next) {
    try
    {
        console.log("ATTEND IS");
        console.log(attend);
        attend.ClockOut = Date();
        console.log(attend);
        ClockOut(attend);
    }
    catch(err){
        console.log(err);
    }
}

async function ClockOut(req, res, next) {
    try {
        console.log(req.body);
        console.log("p1 logged out");
        console.log(req._id);
        await ATTENDANCE.findByIdAndDelete(req._id);
        await ATTENDANCE.insertMany(req);
        console.log("Attendance Saved");
        //res.send(emp);     
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
    userlogout: userlogout,
    ClockOut: ClockOut,

};