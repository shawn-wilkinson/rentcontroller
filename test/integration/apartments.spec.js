/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
const Apartment = require('../../dst/models/apartment');

describe('apartments', () => {
    beforeEach((done) => {
      cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
        done();
      });
    });
  describe('get /apartments',()=>{
    it('should get all the apartments',(done)=>{
      request(app)
      .get('/apartments')
        .end((err,rsp)=> {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.apartments).to.have.length(4);
          done();
        });
    });
  });
  describe('get /apartments/:id',()=>{
    it('should return the apartment with the specified id',(done)=>{
      request(app)
      .get('/apartments/012345678901234567890013')
        .end((err, rsp)=> {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.apartment.name).to.equal('a3');
          done();
        });
    });
  });
  describe('get /apartments/id',()=>{
    it('should not return the apartment with the specified id as id is invalid',(done)=>{
      request(app)
      .get('/apartments/012345678901234567890013adadewedwedwde')
        .end((err, rsp)=> {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages).to.deep.equal([ '"id" with value "012345678901234567890013adadewedwedwde" fails to match the required pattern: /^[0-9a-f]{24}$/' ]);
          done();
        });
    });
  });

  describe('post /apartments', () => {
    it('should create an apartment', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'a4', sqft: 2000, bedrooms: 4, floor: 4, rent: 1800 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.__v).to.not.be.null;
        expect(rsp.body.apartment._id).to.not.be.null;
        expect(rsp.body.apartment.name).to.equal('a4');
        done();
      });
    });
  });

  describe('post /apartments', () => {
    it('should not create an apartment- too high of floors(not available)', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'a4', sqft: 2000,bedrooms: 4, floor: 21, rent: 1800 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal([ '"floor" must be less than or equal to 20' ]);
        done();
      });
    });
  });

  describe('put /apartments/:id', () => {
    it('should update an apartment', (done) => {
      request(app)
      .put('/apartments/012345678901234567890013')
      .send({ name: 'a3', sqft: 2000, bedrooms: 4, floor: 4, rent: 3500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.rent).to.equal(3500);
        expect(rsp.body.apartment.name).to.equal('a3');
        done();
      });
    });
    it('should not update an apartment - invalid apartment id', (done) => {
      request(app)
      .put('/apartments/01234567890123456789001')
      .send({ name: 'a3', sqft: 2000, bedrooms: 4, floor: 4, rent: 3500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal([ '"id" with value "01234567890123456789001" fails to match the required pattern: /^[0-9a-f]{24}$/' ]);
        done();
      });
    });
    it('should not update an apartment - rent is required and not included', (done) => {
      request(app)
      .put('/apartments/012345678901234567890013')
      .send({ name: 'a3', sqft: 2000, bedrooms: 4, floor: 4 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"rent" is required']);
        done();
      });
    });
  });

  describe('delete /apartments/:id', () => {
    it('should delete an apartment', (done) => {
      request(app)
      .delete('/apartments/012345678901234567890013')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.id).to.equal('012345678901234567890013');
        done();
      });
    });

    it('should NOT delete an appartment - does not exist', (done) => {
      request(app)
      .delete('/apartments/01234567890123456789abcd')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.equal('id not found');
        done();
      });
    });

    it('should NOT delete an apartment - bad id', (done) => {
      request(app)
      .delete('/apartments/wrong')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "wrong" fails to match the required pattern');
        done();
      });
    });
  });

  describe('put /apartments/:id/lease', () => {
    it.only('should lease an apartment to a renter', (done) => {
      request(app)
      .put('/apartments/012345678901234567890014/lease')
      .send({ renterId: '012345678901234567890024' })
      .end((err, rsp) => {
        expect(rsp.status).to.equal(200);
        expect(err).to.be.null;
        expect(rsp.body.leasedApartment.renter.name).to.equal('Lilly');
        expect(rsp.body.leasedApartment.apartment.name).to.equal('a10');
        done();
      });
    });
  });
});
