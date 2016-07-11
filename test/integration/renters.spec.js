const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
const Renter = require('../../dst/models/renter');


describe('renters', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('get /renters',()=>{
    it('should get all the renters',(done)=>{
      request(app)
      .get('/renters')
        .end((err,rsp)=> {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.renters).to.have.length(4);
          done();
        });
    });
  });

  describe('get /renters/:id',()=>{
    it('should return the renter with the specified id',(done)=>{
      request(app)
      .get('/renters/012345678901234567890021')
        .end((err, rsp)=> {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.renter.name).to.equal('Joe');
          done();
        });
    });
    it('should not return a renter - invalid id',(done)=>{
      request(app)
      .get('/renters/012345678901')
        .end((err, rsp)=> {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages).to.deep.equal([ '"id" with value "012345678901" fails to match the required pattern: /^[0-9a-f]{24}$/' ]);
          done();
        });
    });
  });

  describe('post /renters', () => {
    it('should create a renter', (done) => {
      request(app)
      .post('/renters')
      .send({ name: 'Sara', money: 200000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.__v).to.not.be.null;
        expect(rsp.body.renter._id).to.not.be.null;
        expect(rsp.body.renter.name).to.equal('Sara');
        done();
      });
    });
    it('should not create a renter- name is required', (done) => {
      request(app)
      .post('/renters')
      .send({ money: 200000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal([ '"name" is required' ]);
        done();
      });
    });
  });


  describe('delete /renters/:id', () => {
    it('should delete a renter', (done) => {
      request(app)
      .delete('/renters/012345678901234567890021')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.id).to.equal('012345678901234567890021');
        done();
      });
    });

    it('should NOT delete a renter - does not exist', (done) => {
      request(app)
      .delete('/renters/01234567890123456789abcd')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.equal('id not found');
        done();
      });
    });

    it('should NOT delete a renter - bad id', (done) => {
      request(app)
      .delete('/renters/wrong')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "wrong" fails to match the required pattern');
        done();
      });
    });
  });

  describe('put /renters/:id', () => {
    it('should update a renter', (done) => {
      request(app)
      .put('/renters/012345678901234567890021')
      .send({ name: 'Sara', money: 200001  })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.money).to.equal(200001);
        expect(rsp.body.renter.name).to.equal('Sara');
        done();
      });
    });
    it('should not update a renter - invalid renter id', (done) => {
      request(app)
      .put('/renters/01234567890123456789001xxx')
      .send({ name: 'Sara', money: 200001 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal([ '"id" with value "01234567890123456789001xxx" fails to match the required pattern: /^[0-9a-f]{24}$/' ]);
        done();
      });
    });
    it('should not update a renter - money is required and not included', (done) => {
      request(app)
      .put('/renters/012345678901234567890021')
      .send({ name: 'Sara'  })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal([ '"money" is required' ]);
        done();
      });
    });
  });

})
