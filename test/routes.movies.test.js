process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const should = chai.should();
const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : MOVIES', () => {
  beforeEach(() => {
    return knex.migrate
      .rollback()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        return knex.seed.run();
      });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/movies', () => {
    it('should return all movies', done => {
      chai
        .request(server)
        .get('/api/v1/movies')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data.length.should.eql(3);
          res.body.data[0].should.include.keys(
            'id',
            'name',
            'genre',
            'rating',
            'explicit'
          );
          done();
        });
    });
  });

  describe('GET /api/v1/movies:id', () => {
    it('should return a single movie', done => {
      chai
        .request(server)
        .get('/api/v1/movies/1')
        .end((err, res) => {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(
            'id',
            'name',
            'genre',
            'rating',
            'explicit'
          );
          done();
        });
    });

    it('should throw an error if the movie does not exist', done => {
      chai
        .request(server)
        .get('/api/v1/movies/9999999')
        .end((err, res) => {
          res.status.should.equal(404);
          res.type.should.equal('application/json');
          res.body.status.should.eql('error');
          res.body.message.should.eql('That movie does not exist.');
          done();
        });
    });
  });

  describe('POST /api/v1/movies', () => {
    it('should return the movie that was added', done => {
      chai
        .request(server)
        .post('/api/v1/movies')
        .send({
          name: 'Titanic',
          genre: 'Drama',
          rating: 8,
          explicit: true,
        })
        .end((err, res) => {
          res.status.should.equal(201);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(
            'id',
            'name',
            'genre',
            'rating',
            'explicit'
          );
          done();
        });
    });

    it('should throw an error if the payload is malformed', done => {
      chai
        .request(server)
        .post('/api/v1/movies')
        .send({
          name: 'Titanic',
        })
        .end((err, res) => {
          res.status.should.equal(400);
          res.type.should.equal('application/json');
          res.body.status.should.eql('error');
          should.exist(res.body.message);
          done();
        });
    });
  });

  describe('PUT /api/v1/movies', () => {
    it('should return the movie that was updated', done => {
      knex('movies')
        .select('*')
        .then(movie => {
          const movieObject = movie[0];
          chai
            .request(server)
            .put(`/api/v1/movies/${movieObject.id}`)
            .send({
              rating: 9,
            })
            .end((err, res) => {
              res.status.should.equal(200);
              res.type.should.equal('application/json');
              res.body.status.should.eql('success');
              res.body.data[0].should.include.keys(
                'id',
                'name',
                'genre',
                'rating',
                'explicit'
              );

              const newMovieObject = res.body.data[0];
              newMovieObject.rating.should.not.eql(movieObject.rating);
              done();
            });
        });
    });

    it('should throw an error if the movie does not exist', done => {
      chai
        .request(server)
        .put('/api/v1/movies/9999999')
        .send({
          rating: 9,
        })
        .end((err, res) => {
          res.status.should.equal(404);
          res.type.should.equal('application/json');
          res.body.status.should.eql('error');
          res.body.message.should.eql('That movie does not exist.');
          done();
        });
    });
  });

  describe('DELETE /api/v1/movies/:id', () => {
    it('should return the movie that was deleted', done => {
      knex('movies')
        .select('*')
        .then(movies => {
          const movieObject = movies[0];
          const lengthBeforeDelete = movies.length;
          chai
            .request(server)
            .delete(`/api/v1/movies/${movieObject.id}`)
            .end((err, res) => {
              res.status.should.equal(200);
              res.type.should.equal('application/json');
              res.body.status.should.eql('success');
              res.body.data[0].should.include.keys(
                'id',
                'name',
                'genre',
                'rating',
                'explicit'
              );
              knex('movies')
                .select('*')
                .then(updatedMovies => {
                  updatedMovies.length.should.eql(lengthBeforeDelete - 1);
                  done();
                });
            });
        });
    });

    it('should throw an error if the movie does not exist', done => {
      chai
        .request(server)
        .delete('/api/v1/movies/9999999')
        .end((err, res) => {
          res.status.should.equal(404);
          res.type.should.equal('application/json');
          res.body.status.should.eql('error');
          res.body.message.should.eql('That movie does not exist.');
          done();
        });
    });
  });
});
