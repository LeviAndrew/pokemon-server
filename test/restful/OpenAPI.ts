import * as path from 'path';
import {TestManager} from '../TestManager';

const chai: any = require('chai');
const chaiHTTP = require('chai-http');
const config = require(path.resolve('devConfig.json'));

chai.use(chaiHTTP);
let expect = chai.expect;
let testManager = null;
const baseURL = `http://localhost:${config.server.port}`;

describe('API', () => {

  before((done) => {
    testManager = new TestManager(done);
  });

  describe("LOCALE", () => {

    it("Get", (done) => {
      chai.request(baseURL)
        .get('/api/locale/pt-Br')
        .end((error, response) => {
          expect(response.body).to.be.instanceof(Object);
          expect(response.body).to.have.all.keys("success", "data");
          expect(response.body.success).to.be.true;
          expect(response.body.data).to.be.instanceof(Object);
          done();
        });
    });

  });

  describe('LOGIN', () => {

    it('OK', (done) => {
      chai.request(baseURL)
        .post("/api/login")
        .send({
          login: 'admin@admin.com',
          password: 'admin'
        })
        .end((error, response) => {
          expect(response.body).to.be.instanceof(Object);
          expect(response.body).to.have.all.keys("success", "data");
          expect(response.body.success).to.be.true;
          expect(response.body.data).to.be.instanceof(Object);
          expect(response.body.data).to.have.all.keys("name", "surname", "email", "id", "_id", "authenticationKey", "type", "accessKey");
          done();
        })
    });

    it('Already logged', (done) => {
      chai.request(baseURL)
        .post("/api/login")
        .send({
          login: 'admin@admin.com',
          password: 'admin'
        })
        .end((error, response) => {
          expect(response.body).to.be.instanceof(Object);
          expect(response.body).to.have.all.keys("success", "data");
          expect(response.body.success).to.be.false;
          expect(response.body.data).to.be.instanceof(Object);
          expect(response.body.data).to.have.all.keys("title", "description", "buttons", "type");
          expect(response.body.data.buttons).to.be.instanceof(Array);
          response.body.data.buttons.forEach(button => {
            expect(button).to.be.instanceof(Object);
            expect(button).to.have.all.keys("label", "method");
          });
          done();
        })
    });

    it('Invalid login', (done) => {
      chai.request(baseURL)
        .post("/api/login")
        .send({
          login: 'admins@admin.com',
          password: 'admin'
        })
        .end((error, response) => {
          expect(response.body).to.be.instanceof(Object);
          expect(response.body).to.have.all.keys("success", "data");
          expect(response.body.success).to.be.false;
          expect(response.body.data).to.be.instanceof(Object);
          expect(response.body.data).to.have.all.keys("title", "description", "buttons", "type");
          expect(response.body.data.buttons).to.be.instanceof(Array);
          response.body.data.buttons.forEach(button => {
            expect(button).to.be.instanceof(Object);
            expect(button).to.have.all.keys("label", "method");
          });
          done();
        })
    });

    it('Wrong password', (done) => {
      chai.request(baseURL)
        .post("/api/login")
        .send({
          login: 'admin@admin.com',
          password: 'admins'
        })
        .end((error, response) => {
          expect(response.body).to.be.instanceof(Object);
          expect(response.body).to.have.all.keys("success", "data");
          expect(response.body.success).to.be.false;
          expect(response.body.data).to.be.instanceof(Object);
          expect(response.body.data).to.have.all.keys("title", "description", "buttons", "type");
          expect(response.body.data.buttons).to.be.instanceof(Array);
          response.body.data.buttons.forEach(button => {
            expect(button).to.be.instanceof(Object);
            expect(button).to.have.all.keys("label", "method");
          });
          done();
        })
    });

  });

});