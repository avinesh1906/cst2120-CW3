// Entire script will be in script mode
"use strict";

import {emailValidation, passwordValidation, restoNameValidation, restoStreetValidation, restoTownValidation, restoTelValidation, restoEmailValidation, fileValidation} from './validation.js';
import {registerResto, home, login} from './layout.js';

// variables
let loginBtn = document.getElementById("loginBUTTON");
let registerBtn = document.getElementById("register");

//Set up page when window has loaded
window.onload = init;

loginBtn.addEventListener('click', loginAdmin); 
registerBtn.addEventListener('click', register); 
document.querySelector('#searchRegion').addEventListener('click', searchRegion)

//Get pointers to parts of the DOM after the page has loaded.
function init(){
    sessionStorage.setItem("logged", false);
    loadRegion();
}

/* Loads available region and adds them to the page. */
function loadRegion() {
    let regionClass = document.getElementsByClassName("search_bar")[0];
    let registerRegion = document.getElementById("registerRegion");
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            let regionArr = JSON.parse(xhttp.responseText);
            //Return if no users
            if(regionArr.length === 0)
                return;
    
            //Build string with user data
            let htmlStr = "<option value=\"\" selected style=\"display: none\">Select your location</option>";
            for(let key in regionArr){
                htmlStr += ("<option value=" + regionArr[key].id +">"+regionArr[key].name+"</option>");
            }
            //Add users to page.
            regionClass.innerHTML = htmlStr;
            registerRegion.innerHTML = htmlStr;
        }
    };
    
    //Request data from all users
    xhttp.open("GET", "/region", true);
    xhttp.send();
}

/* function to login administrator*/
function loginAdmin() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let usrEmail = document.getElementById("usr_email");
    let usrPwd = document.getElementById("password");
    let usr_details = document.getElementById("usr_details");
    let adminLogin = document.getElementById("adminLogin");

    let usrObj = {
        email: usrEmail.value,
        password: usrPwd.value
    };
    if (emailValidation() && passwordValidation()){
        //Set up function that is called when reply received from server
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == "1") {
                    sessionStorage.setItem("logged", true);
                    adminLogin.innerHTML = "Log Out";
                    home();
                } else {
                    usr_details.innerHTML = "Username/Password wrong";
                    usr_details.style.color = "#DA1212";
                }
            }        
        };
            
        //Request data from all users
        xhttp.open("POST", "/validateUsr", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send( JSON.stringify(usrObj) );
    } else {
        loginBtn.disabled = true;
    }    
}

// function to register a restaurant
function register() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    // extract variables from registration form
    let name = document.getElementById("restoName");
    let street = document.getElementById("street");
    let town = document.getElementById("town");
    let selectRegion = document.querySelector('#registerRegion');
    let region = selectRegion.options[selectRegion.selectedIndex].value;
    let telephone = document.getElementById("telephone");
    let email = document.getElementById("restoEmail");
    let cuisineDetails = document.getElementById("cuisineDetails");
    let fileArray = document.getElementById("restoMenu").files;

    let monday_opening = document.getElementById("monday_opening");
    let monday_closing = document.getElementById("monday_closing");
    let tuesday_opening = document.getElementById("tuesday_opening");
    let tuesday_closing = document.getElementById("tuesday_closing");
    let wednesday_opening = document.getElementById("wednesday_opening");
    let wednesday_closing = document.getElementById("wednesday_closing");
    let thursday_opening = document.getElementById("thursday_opening");
    let thursday_closing = document.getElementById("thursday_closing");
    let friday_opening = document.getElementById("friday_opening");
    let friday_closing = document.getElementById("friday_closing");
    let saturday_opening = document.getElementById("saturday_opening");
    let saturday_closing = document.getElementById("saturday_closing");
    let sunday_opening = document.getElementById("sunday_opening");
    let sunday_closing = document.getElementById("sunday_closing");

    //Put file inside FormData object
    const formData = new FormData();
    formData.append('myFile', fileArray[0]);

    let register_Obj = {
        name: name.value,
        street: street.value,
        town: town.value,
        region: region,
        telephone: telephone.value,
        email: email.value,
        cuisineDetails: cuisineDetails.value,
        time: {
            monday: [monday_opening.value, monday_closing.value],
            tuesday: [tuesday_opening.value, tuesday_closing.value],
            wednesday: [wednesday_opening.value, wednesday_closing.value],
            thursday: [thursday_opening.value, thursday_closing.value],
            friday: [friday_opening.value, friday_closing.value],
            saturday: [saturday_opening.value, saturday_closing.value],
            sunday: [sunday_opening.value, sunday_closing.value],
        }
    }
    for (var key in register_Obj) {
        if (key == "time"){
            formData.append(key, JSON.stringify(register_Obj[key]));
        } else {
            formData.append(key, register_Obj[key]);
        }
        
    }

    if (restoNameValidation() && restoStreetValidation() && restoTownValidation() && restoTelValidation() && restoEmailValidation() && fileValidation()){
        // Set up function that is called when reply received from server
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == "1") {
                    home();
                } else {
                    console.log("Error");
                }
            }        
        };
            
        //Request data from all users
        xhttp.open("POST", "/registerResto", true);
        xhttp.send(formData );
    // disable button if not met condition
    } else {
        registerBtn.disabled = true;
    }
    
}

let timeFunc = function extractTime(regionID) {  
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    let regionObj = {
        region: regionID
    };
    return new Promise((resolve, reject)=>{
        let url = "/region?time=" + encodeURIComponent(JSON.stringify(regionObj)) ;
        //Request data from all users
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                //Convert JSON to a JavaScript object
                let restoTime = xhttp.responseText;      
                resolve(restoTime);
            }  
        };
    });
    
}


function searchRegion()
{
    let selectElement = document.querySelector('#search_bar');
    let regionID = selectElement.options[selectElement.selectedIndex].value;
    let accordion = document.getElementsByClassName("accordion")[0];
    accordion.scrollIntoView();
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    let regionObj = {
        region: regionID
    };
    let htmlStr = "";
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //Convert JSON to a JavaScript object
            let restoArr = JSON.parse(xhttp.responseText);
            timeFunc(regionID, 1).then((res) =>{
                let timeArr = JSON.parse(res);
                for(let key in restoArr){
                    htmlStr += '<div class="accordion-item" id='+ restoArr[key].id +'>';
                    htmlStr += '          <h2 class="accordion-header">';
                    htmlStr += '            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse'+ restoArr[key].id +'" aria-expanded="true" aria-controls="collapseOne">';
                    htmlStr += '                <div id="restoName">'+ restoArr[key].name +'</div>';
                    htmlStr += '                <div class="fullAddress">';
                    htmlStr += '                    <div id="restoStreet">'+ restoArr[key].street +'</div>';
                    htmlStr += '                    <div id="restoTown">'+ restoArr[key].city +'</div>';
                    htmlStr += '                </div>';
                    htmlStr += '                <div id="restoTel">'+ restoArr[key].phone +'</div>';
                    htmlStr += '                <div id="restoEmail">'+ restoArr[key].email +'</div>';
                    htmlStr += '                <div id="restoCuisineDetails">'+ restoArr[key].cuisine_details +'</div>';
                    htmlStr += '            </button>';
                    htmlStr += '          </h2>';
                    htmlStr += '          <div id="collapse'+ restoArr[key].id +'" class="accordion-collapse collapse" aria-labelledby="headingOne" >';
                    htmlStr += '            <div class="accordion-body">';
                    htmlStr += '                <div class="restoTime">';
                    htmlStr += '                    <div class="btn-group dropend">';
                    htmlStr += '                        <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">';
                    htmlStr += '                            Opening Time';
                    htmlStr += '                        </button>';
                    htmlStr += '                        <ul class="dropdown-menu">';
                    htmlStr += '                          <!-- Dropdown menu links -->';
                    for (let timeKey in timeArr){
                        if (timeArr[timeKey].restaurant_id == restoArr[key].id ){
                            htmlStr += '<li><a class="dropdown-item">'+ timeArr[timeKey].day +':'+ timeArr[timeKey].opening_time +' - '+ timeArr[timeKey].closing_time +'</a></li>';
                        }
                    }
                    htmlStr += '                        </ul>';
                    htmlStr += '                     </div>';
                    htmlStr += '                </div>';
                    htmlStr += '            </div>';
                    htmlStr += '          </div>';
                    htmlStr += '        </div>';
                }
                accordion.innerHTML = htmlStr;
            });
        }        
    };
    let url = "/region?data=" + encodeURIComponent(JSON.stringify(regionObj)) ;
    //Request data from all users
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function logged() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //Convert JSON to a JavaScript object
            let loginVar = JSON.parse(this.responseText);
            for(let key in loginVar){
                if (!loginVar[key]) {
                    login();
                }else {
                    logout();
                }
            }
        }
    };

    //Request data from all users
    xhttp.open("GET", "/checklogin", true);
    xhttp.send();
}

function logout(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    let adminLogin = document.getElementById("adminLogin");

    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //Convert JSON to a JavaScript object
            let loginVar = JSON.parse(this.responseText);
            for(let key in loginVar){
                if (!loginVar[key]) {
                    sessionStorage.setItem("logged", false);
                    adminLogin.innerHTML = "Admin Login?";
                    home();
                } else {
                    console.log("Error");
                }
            }
        }
    };
    //Request data from all users
    xhttp.open("GET", "/logout", true);
    xhttp.send();
}

export {logged, logout};