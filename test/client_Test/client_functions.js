// function to check if there's any logged in user
export function checkLoginUser(){
    let loggedUsr = sessionStorage.getItem("logged");
    return loggedUsr;
}

// function to validate username
export function emailValidation(email) {
    // Regular expression for validating email
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // check if pass the regex
    if (!email.match(re)){
        return false;
    }
    return true;
}

// function to validate password
export function passwordValidation(password) {
    // check if input field is empty
    if (password.length == 0) {
        return false;
    }
    return true;
}