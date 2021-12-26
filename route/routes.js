const express = require("express");
const empcontroller = require("../controller/employee.js");
const path = require('path');
const SearchEmpbyusername  = express.Router();
const SearchEmpbyEmail  = express.Router();
const backend_router_addemp  = express.Router();
const login  = express.Router();
const logout  = express.Router();

login.get('/', () => {
    res.sendFile(path.join(__dirname, '..', 'view/login.html'));
})

login.post('/', (req, res) => {
    console.log(req.body);
    console.log("Before Logging");
    empcontroller.userlogin(req, res);
});



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
    login: login,
    SearchEmpbyusername : SearchEmpbyusername,
    SearchEmpbyEmail : SearchEmpbyEmail,
    backend_router_addemp : backend_router_addemp,
    logout: logout,
  };