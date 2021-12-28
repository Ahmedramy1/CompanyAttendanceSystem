const express = require("express");
const empcontroller = require("../controller/employee.js");
const path = require('path');
const router = express.Router();


// Login
router
.route('/')
.get((req, res) => {
    console.log("Redirected to login");
    if(req.session.isAuth)
    {
        console.log("Authenticated");
        if(req.session.privilege == "HR")
        {return res.redirect('/hrdashboard');}
        return res.redirect('/dashboard');
    }
    console.log("Not Authenticated");
    res.sendFile(path.join(__dirname, '..', 'view/login.html'));
})
.post((req, res) => {
    console.log(req.body);
    console.log("Before Logging");
    empcontroller.userlogin(req, res);
});

// Register
router
.route('/register')
.get((req, res) => {
     if(req.session.isAuth)
     {
         return res.redirect('/');
     }
    res.sendFile(path.join(__dirname, '..', 'view/add_employee.html'));
 })
 .post((req, res) => {
    empcontroller.AddEmployee(req, res);
});


// Generate Reports
router
.route('/generate')
.get((req, res) => {
    if(req.session.isAuth && req.session.privilege == "HR")
    {
        return empcontroller.GenerateReports(req, res);
    }
    else
    {
        return res.redirect('/');
    }
});

// Employee dashboard
router
.route('/dashboard')
.get((req, res) => {
    if(req.session.privilege == "Employee")
    {
        console.log("routing to dashboard");
        return res.sendFile(path.join(__dirname, '..', 'view/dashboard.html'));
    }
    res.redirect('/');
});

// HR dashboard
router
.route('/hrdashboard')
.get((req, res) => {
    if(req.session.privilege == "HR")
    {
        console.log("routing to HR dashboard");
        return res.sendFile(path.join(__dirname, '..', 'view/hrdashboard.html'));
    }
    res.redirect('/');
});

// Search for Employee by Email
router
.route('/search_emp')
.post((req, res) => {
    //console.log(req);
    if(req.session.privilege == "HR")
    {
        return empcontroller.SearchuserbyEmail(req, res);
    }
    res.redirect('/');
})

// Remove Employee
router
.route('/rem_employee')
.post((req, res) => {
    if(req.session.privilege == "HR")
    {
        return empcontroller.rem_employee(req, res);
    }
    res.redirect('/');
});

// Logout
router
.route('/logout')
.post((req, res) => {
    if(req.session.isAuth)
    {
        console.log("Logging Out...");
        return empcontroller.userlogout(req, res);
    }
    res.redirect('/');
});

module.exports = {
    router: router,
  };