//Import the express and body-parser modules
const express = require('express');
const bodyParser = require('body-parser');

//Import the mysql module
const mysql = require('mysql');

//Create a connection pool with the user details
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "avinesh",
    password: "Cm3tc7At",
    database: "restofinder",
    debug: false
});

//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());

//Set up express to serve static files from the directory called 'restoFinderApp'
app.use(express.static('restoFinderApp'));

//Data structure that will be accessed using the web service
let regionArray = [];

/* Returns a promise to get regions. */
async function getRegion(){
  //Build query
  let sql = "SELECT * FROM region";

  //Wrap the execution of the query in a promise
  return new Promise ( (resolve, reject) => { 
      connectionPool.query(sql, (err, result) => {
          if (err){//Check for errors
              reject("Error executing query: " + JSON.stringify(err));
          }
          else{//Resolve promise with results
              resolve(result);
          }
      });
  });
}

/* Returns a promise to get specific user. */
async function getUsr(userEmail){
    //Build query
    let sql = "SELECT password FROM admin WHERE email=\"" + userEmail + "\"";

    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
  }
  
//Execute promise
getRegion().then ( result => {
  //Append to region Array.
  regionArray = JSON.stringify(result);

}).catch( err => {//Handle the error
  console.error(JSON.stringify(err));
});

//Set up application to handle GET requests sent to the user path
app.get('/region', handleGetRequest);//Returns all users
app.post('/validateUsr', handlePostUsrRequest);//Validate user

//Set up application to handle POST requests sent to the user path
// app.post('/validateUsr', handlePostRequest);//Validate user

//Start the app listening on port 8080
app.listen(8080);

//Handles GET requests to our web service
function handleGetRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    //If path ends with 'users' we return all users
    if(pathEnd === 'region'){
        response.send(regionArray);
    }

    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}

//Handles GET requests to our web service
function handlePostUsrRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    if (pathEnd === 'validateUsr'){
        // retrieve the user object
        let userObj = request.body;

        //Execute promise
        getUsr(userObj['email']).then ( result => {
            //Append to region Array.
            if (userObj["password"] == result[0].password){
                response.send("1");
            } else {
                response.send("0");
            }
        }).catch( err => {//Handle the error
            response.send("0");
        });
    }

    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}
