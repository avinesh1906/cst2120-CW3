// Entire script will be in script mode
"use strict";

import {logged, logout} from './client.js';

document.querySelector('.top').querySelector('.link').querySelector('#registerResto').addEventListener('click', registerResto)
document.querySelector('.loginAdmin').querySelector('.header').querySelector('#link').addEventListener('click', home)
document.querySelector('.restoRegistration').querySelector('.header').querySelector('#link').addEventListener('click', home)
document.querySelector('.top').querySelector('.link').querySelector('#adminLogin').addEventListener('click', login)

let topClass = document.getElementsByClassName("top")[0];
let loginAdminClass = document.getElementsByClassName("loginAdmin")[0];
let restoRegistrationClass = document.getElementsByClassName("restoRegistration")[0];

function registerResto(){
    let loggedUsr = sessionStorage.getItem("logged");
    if (loggedUsr == "false") {
        login();
    } else {
        topClass.style.display = "none";
        restoRegistrationClass.style.display = "block";
        loginAdminClass.style.display = "none";
    }
}

function home() {
    topClass.style.display = "flex";
    restoRegistrationClass.style.display = "none";
    loginAdminClass.style.display = "none"
}

function login() {
    let loggedUsr = sessionStorage.getItem("logged");
    if (loggedUsr == "true") {
        logout();
    } else {
        console.log("qeqerqwe");
        topClass.style.display = "none";
        restoRegistrationClass.style.display = "none";
        loginAdminClass.style.display = "block";
    }

}

export {registerResto, home, login};
