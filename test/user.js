const chai = require('chai');
const request = require('supertest')

const server = require('../routes/userRouter')

const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);


describe('Todo API', function() {

    it('Register user, login user, check token get all update delete', function(done) {
        chai.request(server)

            // register request
            .post('/register')

            // send user registration details
            .send({
                    '_id' : 1,
                    'name': 'AT',
                    'email': 'test@gmail.com',
                    'password': 'test'
                }

            ) // this is like sending $http.post or this.http.post in Angular
            .send({
                '_id' : 2,
                'name': 'Lucy',
                'email': 'test2@gmail.com',
                'password': 'test2'
            }

            ) 
            .end((err, res) => { // when we get a resonse from the endpoint

                // in other words,
                // the res object should have a status of 201
                res.should.have.status(201);

                // follow up with login
                chai.request(server)
                    .post('/login')
                    // send user login details
                    .send({
                        'email': 'test@gmail.com',
                        'password': 'test'
                    })
                    .end((err, res) => {
                        console.log('this runs the login part');
                        res.body.should.have.property('token');
                        var token = res.body.token;

                        // follow up with requesting user protected page
                        chai.request(server)
                            .get('/all')
                            .end(function(err, res) {
                                chai.request(server)
                                    .patch('/update')
                                    .send({
                                        'name': 'AT1',
                                        'email': 'test@gmail.com',
                                        'password': 'test'
                                    })
                                    .end(function(err, res) {
                                        let id = 2;
                                        chai.request(server)
                                            .detete('/delete'+ id)
                                            .set('Authorization', 'JWT ' + token)
                                            // we set the auth header with our token
                                            .end(function(error, resonse) {
                                                resonse.should.have.status(200);
                                                resonse.body.should.have.property('message');
                                                resonse.body.message.should.equal('Authorized User, Action Successful!');
                                            });
                                    })

                            })
                    })
            })
            done();
    })
})