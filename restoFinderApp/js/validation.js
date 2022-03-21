// Entire script will be in script mode
"use strict";

// global variables
let email = document.getElementById("usr_email");
let pwd = document.getElementById("password");
let btn = document.getElementById("loginBUTTON");
let registerBtn = document.getElementById("register");
let restoName = document.getElementById("restoName");
let street = document.getElementById("street");
let town = document.getElementById("town");
let telephone = document.getElementById("telephone");
let restoEmail = document.getElementById("restoEmail");

// event listener
email.addEventListener('keyup', emailValidation);
pwd.addEventListener('keyup', passwordValidation);
restoName.addEventListener('keyup', restoNameValidation);
street.addEventListener('keyup', restoStreetValidation);
town.addEventListener('keyup', restoTownValidation);
telephone.addEventListener('keyup', restoTelValidation);
restoEmail.addEventListener('keyup', restoEmailValidation);

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

function restoNameValidation() {
    // local variable
    let details = document.getElementById("name_details");

    // check if input field is empty
    if (restoName.value.length == 0) {
        btn.disabled = true;
        details.innerHTML = '*required';
        details.style.color = "#DA1212";
        return false;
    }
    registerBtn.disabled = false;
    details.innerHTML = "";
    return true;
}

function restoStreetValidation() {
    // local variable
    let details = document.getElementById("street_details");
    // check if input field is empty
    if (street.value.length == 0) {
        btn.disabled = true;
        details.innerHTML = '*required';
        details.style.color = "#DA1212";
        return false;
    }
    registerBtn.disabled = false;
    details.innerHTML = "";
    return true;
}

function restoTownValidation() {
    // local variable
    let details = document.getElementById("town_details");
    // check if input field is empty
    if (town.value.length == 0) {
        btn.disabled = true;
        details.innerHTML = '*required';
        details.style.color = "#DA1212";
        return false;
    }
    registerBtn.disabled = false;
    details.innerHTML = "";
    return true;
}

function restoTelValidation(){
    // variables 
    let details = document.getElementById("tel_details");

    /* Regular Expression for validating telephone number*/
    let re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    // verify if input field is empty
    if (telephone.value.length == 0) {
        registerBtn.disabled = true;
        details.innerHTML = '*required';
        details.style.color = "#ED3833";
        return false;
    // check if pass the regex 
    } else if (!telephone.value.match(re)) {
        registerBtn.disabled = true; 
        details.innerHTML = '*Enter a valid telephone number';
        details.style.color = "#ED3833";
        return false;
    }    
    registerBtn.disabled = false;
    // success message
    details.innerHTML = "";
    return true;
}

function restoEmailValidation(){
    let details = document.getElementById("email_details");

    // Regular expression for validating email
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // check if input field is empty
    if (restoEmail.value.length == 0) {
        registerBtn.disabled = true;
        details.innerHTML = "*required";
        details.style.color = "#ED3833";
        return false;
    // check if pass the regex
    } else if (!restoEmail.value.match(re)){
        registerBtn.disabled = true;
        details.innerHTML = "Your email address must be in the <br> format of name@domain.com";
        details.style.color = "#ED3833";
        return false;
    }
    registerBtn.disabled = false;
    details.innerHTML = "";
    return true;
}

function fileValidation(){
    let details = document.getElementById("fileUpload_details");
    let fileArray = document.getElementById("restoMenu").files;

    if(fileArray.length !== 1){
        registerBtn.disabled = true;
        details.innerHTML = "Please select file to upload";
        details.style.color = "#ED3833";
        return false;
    }
    registerBtn.disabled = false;
    details.innerHTML = "";
    return true;
}

// Exporting functions
export {emailValidation, passwordValidation, restoNameValidation, restoStreetValidation, restoTownValidation, restoTelValidation, restoEmailValidation, fileValidation}