//Import the mysql module and create a connection pool with user details
const mysql = require('mysql');
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "avinesh",
    password: "123456789",
    database: "restofinder",
    debug: false
});



//Gets all tutors
exports.getAllRegions = (response) => {
    //Build query
    let sql = "SELECT * FROM region";

    //Execute query 
    connectionPool.query(sql, (err, result) => {
        if (err){//Check for errors
            let errMsg = "{Error: " + err + "}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Return results in JSON format 
            response.send(JSON.stringify(result))
        }
    });
};

//Adds a new restaurant to database
exports.addRestaurant = (name, street, city, region, phone, email, cuisine_details, fileName, response) => {
    //Build query
    let sql = "INSERT INTO restaurant (name, street, city, region, phone, email, cuisine_details, fileName) VALUES" +
    "('"+ name+"','"+ street +"','"+ city +"'," +
    "'"+ region +"','"+ phone + "','"+ email + "','"+ cuisine_details + "','"+ fileName +"')";

    //Execute query
    connectionPool.query(sql, (err, result) => {
        if (err){//Check for errors
            let errMsg = "{Error: " + err + "}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Send back result
            response.send("{result: 'Student added successfully'}");
        }
    });
};

//Gets all resto
exports.getAllRestaurants = (response) => {
    //Build query
    let sql = "SELECT * FROM restaurant";

    //Execute query 
    connectionPool.query(sql, (err, result) => {
        if (err){//Check for errors
            let errMsg = "{Error: " + err + "}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Return results in JSON format 
            response.send(JSON.stringify(result))
        }
    });
};