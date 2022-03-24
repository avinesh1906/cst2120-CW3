//File containing the functions that we are testing
import {checkLoginUser, emailValidation, passwordValidation} from './client_functions.js';

//Import expect from chai
let expect = chai.expect;

//Mocha test for login session function
describe('#testLoginSession', () => {
    it('should return the value of logged user in session storage', (done) => {
        //Run some tests that sensibly explore the behaviour of the function
        sessionStorage.setItem("logged", false);
        let result = checkLoginUser();
        expect(result).to.equal('false');

        sessionStorage.setItem("logged", true);
        result = checkLoginUser();
        expect(result).to.equal('true');

        //Call function to signal that test is complete
        done();
    });
});

//Mocha test for emailValidation function
describe('#testEmailValidation', () => {
    it('should verify whether the email satisfies the regex', (done) => {
        //Run some tests that sensibly explore the behaviour of the function
        let result = emailValidation('ac2024@live.comsci');
        expect(result).to.equal(false);

        result = emailValidation('avineshculloo@gmail.com');
        expect(result).to.equal(true);

        //Call function to signal that test is complete
        done();
    });
});

//Mocha test for passwordValidation function
describe('#testPasswordValidation', () => {
    it('should verify whether the password input is empty or not', (done) => {
        //Run some tests that sensibly explore the behaviour of the function
        let result = passwordValidation('');
        expect(result).to.equal(false);

        result = passwordValidation('password@1906C');
        expect(result).to.equal(true);

        //Call function to signal that test is complete
        done();
    });
});
