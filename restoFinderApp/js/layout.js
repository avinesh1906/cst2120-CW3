// Entire script will be in script mode
"use strict";

import {logout, searchRegion} from './client.js';

document.querySelector('.top').querySelector('.link').querySelector('#registerResto').addEventListener('click', registerResto)
document.querySelector('.loginAdmin').querySelector('.header').querySelector('#link').addEventListener('click', home)
document.querySelector('.restoRegistration').querySelector('.header').querySelector('.link').addEventListener('click', home)
document.querySelector('.top').querySelector('.link').querySelector('#adminLogin').addEventListener('click', login)

document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'customerReview'){
        viewReview();
     } else if (e.target && e.target.id== 'addReview') {
        writeReview();
     }
 });

let topClass = document.getElementsByClassName("top")[0];
let loginAdminClass = document.getElementsByClassName("loginAdmin")[0];
let restoRegistrationClass = document.getElementsByClassName("restoRegistration")[0];
let accordionClass = document.getElementsByClassName("accordion")[0];

function registerResto(){
    let loggedUsr = sessionStorage.getItem("logged");
    if (loggedUsr == "false") {
        login();
    } else {
        topClass.style.display = "none";
        restoRegistrationClass.style.display = "block";
        loginAdminClass.style.display = "none";
        accordionClass.style.display = "none";
    }
}

function home() {
    topClass.style.display = "flex";
    restoRegistrationClass.style.display = "none";
    loginAdminClass.style.display = "none";
    accordionClass.style.display = "none";
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
        accordionClass.style.display = "none";
    }

}

function viewReview(){
    searchRegion();
    // hide and show appropriate div
    document.getElementById("reviewQty").style.display = "block";
    document.getElementById("writeReview").style.display = "none";
}

function writeReview(){
    // hide and show appropriate div
    document.getElementById("reviewQty").style.display = "none";
    document.getElementById("writeReview").style.display = "block";

}
export {registerResto, home, login, viewReview};
