const mongoose = require('mongoose');
const EMP = require('../model/employee.js');
const REQ = require('../model/requests.js');
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
        const match = await bcrypt.compare(req.body.password, emp.password);
        if(!match){
            return res.send("Incorrect Password");
        }
        console.log("Logged in Successfully, directing to dashboard");
        req.session.isAuth = true;
        req.session.email = emp.email;
        req.session.username = emp.username;
        req.session.privilege = emp.privilege;
        if(emp.privilege == "Employee")
        {
            req.session.requests = emp.requests;
            console.log(`SESSION REQUESTS: ${req.session.requests}`);
        }
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
    }
    catch(err){
        console.log(err);
    }
}

async function AddEmployee(req, res, next) {
    try {
        //hrrrr
        const emp = new EMP(req.body);
        console.log("Password before encryption");
        console.log(req.body.password);
        const hashpsw = await bcrypt.hash(req.body.password, 12);
        emp.password = hashpsw;
        await EMP.insertMany(emp);
        res.redirect('/');     
    }
    catch(err){
        console.log(err);
        res.sendStatus(404);
    }
}

async function submitrequest(req, next) {
    console.log(req.session.requests);
    if(req.session.requests >= 1)
    {
        return -1;
    }
    let empreq = {
        username: req.session.username,
        email: req.session.email,
        privilege: req.session.privilege,
        type: req.body.reqtype,
        StartsFrom: req.body.startsfrom,
        EndDate: req.body.enddate,
        Description: req.body.description,
    };
    console.log("inserting request");
    await REQ.insertMany(empreq);
    var query = { email: req.session.email };
    console.log("Updating Request for emp");
    await EMP.updateOne(query, {$set: {requests: 1}});
    req.session.requests = 1;
    return 1;
};

async function viewmyreqs(req, res, next) {
    var query = {email: req.session.email};
    const empreq = await REQ.find(query);
    let header = `<table style="width: 80%;"> 
        <tr> 
            <th>Name</th> 
            <th>Email</th> 
            <th>Privilege</th>
            <th>Type</th> 
            <th>Starts</th>
            <th>Ends</th>
            <th>Status</th>
            <th>Description</th>
        </tr>`;

        empreq.forEach(row => {
         header = header + `<td>${row.username}</td>
         <td>${row.email}</td> 
         <td>${row.privilege}</td> 
         <td>${row.type}</td>
         <td>${(JSON.stringify(row.StartsFrom)).substring(1, 11)}</td>
         <td>${(JSON.stringify(row.EndDate)).substring(1, 11)}</td>
         <td>${row.Status}</td>
         <td>${row.Description}</td>
        </tr>`
        });
        return res.send(header);
}


async function GenerateReports(req, res, next) {

    const att = await ATTENDANCE.find();
    let header = `<table style="width: 60%;"> 
                    <tr> 
                        <th>Name</th> 
                        <th>Email</th> 
                        <th>ClockIn</th>
                        <th>ClockOut</th> 
                        <th>Privilege</th>
                        <th>Active</th>
                    </tr>`;
    att.forEach(row => {
        header = header + `<tr> 
                            <td>${row.username}</td> 
                            <td>${row.email}</td> 
                            <td>${(JSON.stringify(row.clockin)).substring(0, 20)}</td>
                            <td>${(JSON.stringify(row.clockout)).substring(0, 20)}</td>
                            <td>${row.privilege}</td>
                            <td>${row.active}</td>
                            </tr>`;
    })
    
    return res.send(header);
};

async function rem_employee(req, res, next) {
    try{
        console.log(req.body.usremail);
        await EMP.deleteOne({email: req.body.usremail})
        return res.send("Deleted");
    }
    catch(err)
    {
        console.log(err);
        res.send("User does not exist");
    }
}

async function SearchuserbyEmail(req, res, next) {
    try
    {
        let usremail = req.body.usremail;
        console.log(req.body);
        var query = { email: usremail };
        const emp = await EMP.findOne(query);
        let user = {
            username: emp.username,
            email: emp.email,
            age: emp.age,
            phonenumber: emp.phonenumber,
            privilege: emp.privilege
        }
        let header = `<table style="width: 30%;"> 
        <tr> 
            <th>Name</th> 
            <th>Email</th> 
            <th>Age</th>
            <th>Phone Number</th> 
            <th>Privilege</th>
        </tr>
        <td>${emp.username}</td>
         <td>${emp.email}</td> 
         <td>${emp.age}</td> 
         <td>${emp.phonenumber}</td>
         <td>${emp.privilege}</td>
        </tr>`;
        return res.send(header);

    }
    catch(err){
        console.log(err);
        res.send("User does not exist");
    }
}

async function viewrequests(req, res, next) {
    const empreq = await REQ.find();
    let header = `<table style="width: 60%;"> 
        <tr> 
            <th>Name</th> 
            <th>Email</th> 
            <th>Privilege</th>
            <th>Type</th> 
            <th>Starts</th>
            <th>Ends</th>
            <th>Status</th>
            <th>Description</th>
        </tr>`;

        empreq.forEach(row => {
         header = header + `<td>${row.username}</td>
         <td>${row.email}</td> 
         <td>${row.privilege}</td> 
         <td>${row.type}</td>
         <td>${(JSON.stringify(row.StartsFrom)).substring(1, 11)}</td>
         <td>${(JSON.stringify(row.EndDate)).substring(1, 11)}</td>
         <td>${row.Status}</td>
         <td>${row.Description}</td>
        </tr>`
        });
        return res.send(header);
}

async function respondtorequest (req, res, next) {
    console.log(`Responding to ${req.body.usremail}`);
    try
    {
        var query = { email: req.body.usremail, Status: "Pending"};
        empreq = await REQ.findOne(query);
        if(!empreq)
        {
            console.log(`Request not found for ${req.body.usremail}`)
            return -1;
        }
        if(empreq.Status != "Pending")
        {
            console.log(`Request is no longer available`);
            return 0;
        }
        await EMP.updateOne(query, {$set: {requests: 0}});
        await REQ.updateOne(query, {$set: {Status: req.body.empreqresponse}});
        return 1;
        
    }
    catch(err)
    {
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
        strdate = req.session.attendance.clockin;
        enddate = req.session.attendance.clockout;
        let totalseconds = (enddate - strdate) /1000 ;
        let hours = totalseconds / 3600;
        let minutes = (hours   - Math.floor(hours)) * 60;
        let seconds = (minutes - Math.floor(minutes)) * 60;
        hours = Math.floor(hours);
        minutes = Math.floor(minutes);
        seconds = Math.floor(seconds);
        req.session.isAuth = false;
        req.session.destroy((err) => {
            try{
                res.send(`<h1>Total time Spent: ${hours} hr ${minutes} min ${seconds} sec </h1>`);
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
    submitrequest: submitrequest,
    SearchuserbyEmail : SearchuserbyEmail,
    ClockIn: ClockIn,
    viewmyreqs: viewmyreqs,
    rem_employee: rem_employee,
    GenerateReports: GenerateReports,
    respondtorequest: respondtorequest,
    viewrequests: viewrequests,
    userlogout: userlogout,
    ClockOut: ClockOut,

};