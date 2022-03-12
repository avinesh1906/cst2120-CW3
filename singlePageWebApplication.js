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

//Execute promise
getRegion().then ( result => {
  //Append to region Array.
  regionArray = JSON.stringify(result);
  console.log(JSON.stringify(result));

}).catch( err => {//Handle the error
  console.error(JSON.stringify(err));
});

//Set up application to handle GET requests sent to the user path
app.get('/region', handleGetRequest);//Returns all users

//Set up application to handle POST requests sent to the user path
app.post('/users', handlePostRequest);//Adds a new user

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

    //If the last part of the path is a valid user id, return data about that user
    else if(pathEnd in userArray){
        response.send(userArray[pathEnd]);
    }

    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}

//Handles POST requests to our web service
function handlePostRequest(request, response){
    //Output the data sent to the server
    let newUser = request.body;
    console.log("Data received: " + JSON.stringify(newUser));

    //Add user to our data structure
    userArray.push(newUser);
    
    //Finish off the interaction.
    response.send("User added successfully.");
}


