// Entire script will be in script mode
"use strict";

// global variables
let email = document.getElementById("email");
let pwd = document.getElementById("password");
let btn = document.getElementById("login");

// function to validate username
function emailValidation() {
    // variables 
    let details = document.getElementById("usr_details");
    // check if input field is empty
    if (email.value.length == 0) {
        btn.disabled = true;
        details.innerHTML = '*required';
        details.style.color = "#DA1212";
        btn.disabled = true;
        return false;
    } 

    // succes message
    btn.disabled = false;
    details.innerHTML = "";
    return true;
    
}

// function to validate password
function passwordValidation() {
    // local variable
    let details = document.getElementById("pwd_details");

    // check if input field is empty
    if (pwd.value.length == 0) {
        btn.disabled = true;
        details.innerHTML = '*required';
        details.style.color = "#DA1212";
        return false;
    }
    btn.disabled = false;
    details.innerHTML = "";
    return true;
}
