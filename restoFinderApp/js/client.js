// Entire script will be in script mode
"use strict";

//Set up page when window has loaded
window.onload = init;

//Get pointers to parts of the DOM after the page has loaded.
function init(){
    loadRegion();
}

/* Loads available region and adds them to the page. */
function loadRegion() {
    let regionClass = document.getElementsByClassName("search_bar")[0];

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
                htmlStr += ("<option value=" + key +">"+regionArr[key].name+"</option>");
            }
            //Add users to page.
            regionClass.innerHTML = htmlStr;
        }
    };
    
    //Request data from all users
    xhttp.open("GET", "/region", true);
    xhttp.send();
}

/* function to login administrator*/
function login() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let usrEmail = document.getElementById("email");
    let usrPwd = document.getElementById("password");

    let usrObj = {
        email: usrEmail.value,
        password: usrPwd.value
    };
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "1") {
                console.log("Validated");
            } else {
                console.log("Error");
            }
        }        
    };
        
    //Request data from all users
    xhttp.open("POST", "/validateUsr", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(usrObj) );
   
}