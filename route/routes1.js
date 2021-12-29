const express = require("express");
const empcontroller = require("../controller/employee.js");
const path = require('path');
const router = express.Router();


// Login
router
.route('/')
.get((req, res) => {
    if(req.session.isAuth)
    {
        console.log("Already Logged in");
        if(req.session.privilege == "HR")
        {return res.redirect('/hrdashboard');}
        return res.redirect('/dashboard');
    }
    console.log("Not Authenticated");
    res.sendFile(path.join(__dirname, '..', 'view/login.html'));
})
.post((req, res) => {
    console.log("Before Logging");
    empcontroller.userlogin(req, res);
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


// Employee Request
router
.route('/REQUEST')
.get((req, res) => {
    if(req.session.privilege == "Employee")
    {
        res.sendFile(path.join(__dirname, '..', 'view/emprequest.html'));
    }
    else {
        res.redirect('/');
    }
})
.post(async (req, res) => {
    try{
    if(req.session.privilege == "Employee")
    {
        console.log("Submitting Request");
        let reqresponse = await empcontroller.submitrequest(req);
        if(reqresponse == 1)
        {
            console.log(`Request Submitted for ${req.session.email}`);
            req.session.requests = 1;
        }
        else{
            console.log(`Reached limit of Request Submissions for ${req.session.email}`);
            res.send(`Reached limit of Request Submissions for ${req.session.email}`);
        }
        res.redirect('dashboard');
    }
    else {
        res.redirect('/');
    }
}
catch(err)
{
    console.log("Error directing back");
}
});

// Employee View Requests
router
.route('/viewmyreqs')
.get((req, res) => {
    if(req.session.privilege == "Employee")
    {
        empcontroller.viewmyreqs(req, res);
    }
    else
    {
        return res.redirect('/');
    }
})




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

// Responding to request
router
.route('/respondtorequest')
.post(async (req, res) => {
    if(req.session.privilege == "HR")
    {
        let resp = await empcontroller.respondtorequest(req);
        if(resp == -1)
            return res.send(`Request not found for ${req.body.usremail}`);
        else if(resp == 0)
            return res.send(`Request is no longer available`);
        return res.send(`Response submitted to ${req.body.usremail}`);
    }
    res.redirect('/');
})


// View Requests
router
.route('/viewreqs')
.get((req, res) => {
    if(req.session.isAuth && req.session.privilege == "HR")
    {
        return empcontroller.viewrequests(req, res);
    }
    else
    {
        return res.redirect('/');
    }
});



module.exports = {
    router: router,
  };