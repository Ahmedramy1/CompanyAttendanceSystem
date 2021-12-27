const express = require("express");
const empcontroller = require("../controller/employee.js");
const path = require('path');
const router = express.Router();

//login.use(express.static('./view/', {index: 'login.html'}));

router
.route('/register')
.get((req, res) => {
    if(req.session.isAuth)
        return res.redirect('/dashboard');
    return res.sendFile(path.join(__dirname, '..', 'view/add_employee.html'));
})


router
.route('/add_emp')
.post((req, res) => {
    empcontroller.AddEmployee(req, res);
})

router
.route('/')
.get((req, res) => {
    if(req.session.isAuth)
    {
        console.log("authed");
        if(req.session.privilege == "HR")
        {return res.redirect('/hrdashboard');}
        else
        {return res.redirect('/dashboard');}
    }
    console.log("not authed");
    return res.sendFile(path.join(__dirname, '..', 'view/login.html'));
})
.post((req, res) => {
    console.log(req.body);
    console.log("Before Logging");
    empcontroller.userlogin(req, res);
});

router
.route('/generate')
.get((req, res) => {
    console.log("GENERATING");
    if(req.session.isAuth && req.session.privilege == "HR")
    {
        return empcontroller.GenerateReports(req, res);
    }
    else
    {
        req.session.destroy((err) => 
        {
            try{}
            catch(err)
            {
                console.log(err);
            }
        });
        return res.redirect('/hrdashboard');
    }
});

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

router
.route('/rem_employee')
.delete((req, res) => {
    console.log("REMOVING");
    empcontroller.remEmp(req, res);
    console.log("Removed Emp");
});

router
.route('/logout')
.post((req, res) => {
    console.log("Logging Out...");
    empcontroller.userlogout(req, res);
});


module.exports = {
    router: router,
  };