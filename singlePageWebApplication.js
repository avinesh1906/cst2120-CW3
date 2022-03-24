//Import the express, body-parser and expressSession modules
const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const fileUpload = require('express-fileupload');

//Import the mysql module
const mysql = require('mysql');
const res = require('express/lib/response');

//Create a connection pool with the user details
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "avinesh",
    password: "123456789",
    database: "restofinder",
    debug: false
});

//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());

//Configure Express to use the file upload module
app.use(fileUpload());

//Set up express to serve static files from the directory called 'restoFinderApp'
app.use(express.static('restoFinderApp'));

//Configure express to use express-session
app.use(
    expressSession({
        secret: 'restoFinder.my secret',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: true
    })
);

//Set up application to handle GET requests 
app.get('/region', handleGetRegionRequest);//Returns all regions
app.get('/region/:data', handleGetRegionRequest);//Returns specific region
app.get('/checklogin', checklogin);//Checks to see if user is logged in.
app.get('/logout', logout);//Logs user out
app.get('/getReview', handleGetReviewRequest);//Logs user out

//Set up application to handle POST requests
app.post('/validateUsr', handlePostUsrRequest);//Validate user
app.post('/registerResto', handlePostRestoRequest);//Register restaurant
app.post('/postReview', handlePostReviewRequest);//Register reviews

//Start the app listening on port 8080
app.listen(8080);

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
  
  }).catch( err => {//Handle the error
    console.error(JSON.stringify(err));
  });

  

/* Returns a promise to get specific regions. */
async function getSpecificRegion(regionID){
    //Build query
    let sql = "SELECT restaurant.id, restaurant.name, restaurant.street, restaurant.city," + 
    "restaurant.phone, restaurant.email, restaurant.cuisine_details, restaurant.fileName, region.name AS region_name " +
    "FROM restaurant INNER JOIN region " +
    "ON restaurant.region = region.id " +
    "WHERE restaurant.region =" + regionID;
    
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

/* Returns a promise to get specific business_hours. */
async function getSpecificTime(regionID){
    //Build query
    let sql = "SELECT business_hours.* "+
    "FROM restaurant INNER JOIN business_hours ON restaurant.id = business_hours.restaurant_id "+
    "WHERE restaurant.region = " + regionID; 

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
  
/* Returns a promise to get specific user. */
async function postResto(register_Obj, myFile){
    //Build query to insert into restaurant
    let restoSql = "INSERT INTO restaurant (name, street, city, region, phone, email, cuisine_details) VALUES" +
                "('"+ register_Obj['name']+"','"+ register_Obj['street'] +"','"+ register_Obj['town'] +"'," +
                "'"+ register_Obj['region'] +"','"+ register_Obj['telephone'] + "','"+ register_Obj['email'] + "','"+ register_Obj['cuisineDetails'] + "')";
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(restoSql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                let timeObj = JSON.parse(register_Obj.time);

                //Build query to insert into business_hours
                for (var key in timeObj) {
                    // create time SQL
                    let time_sql = "INSERT INTO business_hours"  +
                    "(restaurant_id, day, opening_time, closing_time) VALUES" +
                    "('"+ result.insertId +"', '"+ key+"', '"+ timeObj[key][0] +"', '"+ timeObj[key][1] +"')";
                    //Execute query and output results
                    connectionPool.query(time_sql, (err, time_result) => {
                        if (err){//Check for errors
                            console.error("Error executing query: " + JSON.stringify(err));
                        }
                    });
                }
                // save the file to folder uploads
                myFile.mv('./restoFinderApp/uploads/' + result.insertId + "_" + myFile.name, function(err) {
                    if (err)
                        return response.status(500).send('{"filename": "' +
                            myFile.name + '", "upload": false, "error": "' +
                            JSON.stringify(err) + '"}');
                });
                // create sql to update filename 
                let fileSQL = "UPDATE restaurant SET fileName = '"+ result.insertId + "_" + myFile.name +"' WHERE id =" + result.insertId;

                connectionPool.query(fileSQL, (fileErr, FileResult) => {
                    if (fileErr){//Check for errors
                        reject("Error executing query: " + JSON.stringify(fileErr));
                    }
                });            
                resolve(result);
            }
        });
    });
  }


/* Returns a promise to add reviews. */
async function addReview(reviewObj){
    //Build query
    let sql = "INSERT INTO review (restaurant_id, name, email, title, body, date) " +
    "VALUES ('"+ reviewObj['id'] +"','"+ reviewObj['name'] +"','"+ reviewObj['email'] +"','"+ reviewObj['title'] +"','"+ reviewObj['body'] +"','"+ reviewObj['date']+"');";
    console.log(sql);
  
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

/* Returns a promise to get reviews. */
async function getReview(){
    //Build query
    let sql = "SELECT * FROM review";
  
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

//Handles GET requests to our web service
function handleGetRegionRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    //If path ends with 'users' we return all users
    if(pathEnd === 'region'){
        response.send(regionArray);
    } else if (request.query.data) {
        let id = JSON.parse(request.query.data);
        
        //Execute promise
        getSpecificRegion(id['region']).then ( result => {
            //return result.
            response.send(JSON.stringify(result));
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
            response.send("0");
        });
    } else if (request.query.time){
        let id = JSON.parse(request.query.time);
        //Execute promise
        getSpecificTime(id['region']).then ( timeResult => {
            //return result.
            response.send(JSON.stringify(timeResult));
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
            response.send("0");
        });
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
                //Store details of logged in user
                request.session.username = userObj['email'];
                
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

// function to register a restaurant
function handlePostRestoRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    if (pathEnd === 'registerResto'){
        let myFile = request.files.myFile;

        // retrieve the user object
        let register_Obj = request.body;

        //Execute promise
        postResto(register_Obj, myFile).then ( result => {
            //Append to region Array.
            response.send("1");
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
            response.send("0");
        });
    }

    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}

// GET /checklogin. Checks to see if the user has logged in
function checklogin(request, response){
    if(!("username" in request.session))
        response.send('{"login": false}');
    else{
        response.send('{"login":true, "username": "' +
            request.session.username + '" }');
    }
}

// GET /logout. Logs the user out.
function logout(request, response){
    //Destroy session.
    request.session.destroy( err => {
        if(err)
            response.send('{"error": '+ JSON.stringify(err) + '}');
        else
            response.send('{"login":false}');
    });
}

// function to post review
function handlePostReviewRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    // retrieve the user object
    let review_Obj = request.body;

    if (pathEnd === 'postReview'){
        //Execute promise
        addReview(review_Obj).then ( result => {
            response.send("1");
        }).catch( err => {//Handle the error
            response.send("0");
        });
    }
    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}

// function to get reviews
function handleGetReviewRequest(request, response) {
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];
    
    if (pathEnd === 'getReview'){
        //Execute promise
        getReview().then ( timeResult => {
            //return result.
            response.send(JSON.stringify(timeResult));
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
            response.send("0");
        });
    }
    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}