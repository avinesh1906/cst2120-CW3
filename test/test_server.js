//Database code that we are testing
let db = require('../database');

//Server code that we are testing
let server = require ('../web-application-sql') 

//Set up Chai library 
let chai = require('chai');
let should = chai.should();
let assert = chai.assert;
let expect = chai.expect;

//Set up Chai for testing web service
let chaiHttp = require ('chai-http');
chai.use(chaiHttp);

//Import the mysql module and create a connection pool with the user details
const mysql = require('mysql');
//Create a connection pool with the user details
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "avinesh",
    password: "123456789",
    database: "restofinder",
    debug: false
});


//Wrapper for all database tests
describe('Database', () => {

    //Mocha test for getAllRegions method in database module.
    describe('#getAllRegions', () => {
        it('should return all of the regions in the database', (done) => {
            //Mock response object for test
            let response= {};

            /* When there is an error response.staus(ERROR_CODE).json(ERROR_MESSAGE) is called
               Mock object should fail test in this situation. */
            response.status = (errorCode) => {
                return {
                    json: (errorMessage) => {
                        console.log("Error code: " + errorCode + "; Error message: " + errorMessage);
                        assert.fail("Error code: " + errorCode + "; Error message: " + errorMessage);
                        done();
                    }
                }
            };

            //Add send function to mock object
            response.send = (result) => {
                //Convert result to JavaScript object
                let resObj = JSON.parse(result);

                //Check that an array of regions is returned
                resObj.should.be.a('array');

                //Check that appropriate properties are returned
                if(resObj.length > 1){
                    resObj[0].should.have.property('id');
                    resObj[0].should.have.property('name');
                }

                //End of test
                done();
            }

            //Call function that we are testing
            db.getAllRegions(response);
        });
    });

    //Mocha test for addResto method in database module.
    describe('#addResto', () => {
        it('should add a restaurant to the database', (done) => {
            //Mock response object for test
            let response= {};

            /* When there is an error response.staus(ERROR_CODE).json(ERROR_MESSAGE) is called
               Mock object should fail test in this situation. */
            response.status = (errorCode) => {
                return {
                    json: (errorMessage) => {
                        console.log("Error code: " + errorCode + "; Error message: " + errorMessage);
                        assert.fail("Error code: " + errorCode + "; Error message: " + errorMessage);
                        done();
                    }
                }
            };

            //Add send function to mock object. This checks whether function is behaving correctly
            response.send = () => {
                //Check that restaurant has been added to database
                let sql = "SELECT name FROM restaurant WHERE name='" + name + "'";
                connectionPool.query(sql, (err, result) => {
                    if (err){//Check for errors
                        assert.fail(err);//Fail test if this does not work.
                        done();//End test
                    }
                    else{
                        //Check that restaurant has been added
                        expect(result.length).to.equal(1);

                        //Clean up database
                        sql = "DELETE FROM restaurant WHERE name='" + name + "'";
                        connectionPool.query(sql, (err, result) => {
                            if (err){//Check for errors
                                assert.fail(err);//Fail test if this does not work.
                                done();//End test
                            }
                            else{
                                done();//End test
                            }
                        });
                    }
                });
            };

            //Create random restaurant details
            let name = Math.random().toString(36).substring(2, 15);
            let street = Math.random().toString(36).substring(2, 15);
            let city  = Math.random().toString(36).substring(2, 15);
            let region = 3;
            let phone = "58352200";
            let email = "test@gmail.com";
            let cuisine_details = "Mauritian";
            let fileName = "96_test.jpg"

            //Call function to add resto to database
            db.addRestaurant(name, street, city, region, phone, email, cuisine_details, fileName, response);
        });
    });
});

//Wrapper for all web service tests
describe('Web Service', () => {

    //Test of GET request sent to /getRestaurant
    describe('/GET restaurant', () => {
        it('should GET all the restaurant', (done) => {
            chai.request(server)
                .get('/getRestaurant')
                .end((err, response) => {
                    //Check the status code
                    response.should.have.status(200);

                    //Convert returned JSON to JavaScript object
                    let resObj = JSON.parse(response.text);

                    //Check that an array of restaurants is returned
                    resObj.should.be.a('array');
                    //Check that appropriate properties are returned
                    if(resObj.length > 1){
                        resObj[0].should.have.property('id');
                        resObj[0].should.have.property('name');
                        resObj[0].should.have.property('city');
                        resObj[0].should.have.property('street');
                        resObj[0].should.have.property('region');
                        resObj[0].should.have.property('phone');
                        resObj[0].should.have.property('email');
                        resObj[0].should.have.property('cuisine_details');
                        resObj[0].should.have.property('fileName');
                    }

                    //End test
                    done();
                });
        });
    });
});

