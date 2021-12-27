const express = require("express");
const empcontroller = require("../controller/employee.js");
const path = require('path');
const SearchEmpbyusername = express.Router();
const SearchEmpbyEmail  = express.Router();
const backend_router_addemp  = express.Router();
const login  = express.Router();
const logout  = express.Router();
const register = express.Router();
const dashboard = express.Router();
const hrdashboard = express.Router();
const GenerateReports = express.Router();
//login.use(express.static('./view/', {index: 'login.html'}));

register.get('/register', (req, res) => {
    if(req.session.isAuth)
        return res.redirect('/dashboard');
    return res.sendFile(path.join(__dirname, '..', 'view/add_employee.html'));
})

login.get('/', (req, res) => {
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

login.post('/', (req, res) => {
    console.log(req.body);
    console.log("Before Logging");
    empcontroller.userlogin(req, res);
});

hrdashboard.post('/', (req, res) => {
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
        return res.redirect('/');
    }
});



dashboard.get('/', (req, res) => {
    console.log("routing to dashboard");
    return res.sendFile(path.join(__dirname, '..', 'view/dashboard.html'));
});

hrdashboard.get('/', (req, res) => {
    console.log("routing to HR dashboard");
    return res.sendFile(path.join(__dirname, '..', 'view/hrdashboard.html'));
});

hrdashboard.get('/hrdashboard/rem_employee', (req, res) => {
    console.log("REMOVING");
    empcontroller.remEmp(req, res);
    console.log("Removed Emp");
})

logout.post('/', (req, res) => {
    console.log("Logging Out...");
    empcontroller.userlogout(req, res);
});

SearchEmpbyusername.get('/:usernamee', async (req, res) => {
    console.log("Getting employee...");
    console.log(req.params.usernamee);
    empcontroller.SearchEmpbyusername(req, res);
});

SearchEmpbyEmail.get("/:email", async (req, res) => {
    console.log(req.params.email);
    empcontroller.SearchEmpbyEmail(req, res);
});

backend_router_addemp.post('/', (req, res) => {
    empcontroller.AddEmployee(req, res);
    //res.redirect('/');
});



module.exports = {
    dashboard: dashboard,
    hrdashboard: hrdashboard,
    register: register,
    login: login,
    GenerateReports: GenerateReports,
    SearchEmpbyusername : SearchEmpbyusername,
    SearchEmpbyEmail : SearchEmpbyEmail,
    backend_router_addemp : backend_router_addemp,
    logout: logout,
  };