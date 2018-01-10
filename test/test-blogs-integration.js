'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
const expect = chai.expect;


const {BlogPost} = require('../models');
const {runServer, app, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

//Seeding data goes here



function seedBlogPostData() {
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateBlogPostData());
  }
  return BlogPost.insertMany(seedData);
}

function generateTitle() {
  const titles = ['Title #1', 'Title #2', 'Title #3', 'Title #4', 'Title #5'];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateContent() {
  const contents = ['Content #1', 'Content #2', 'Content #3', 'Content #4', 'Content #5'];
  return contents[Math.floor(Math.random() * contents.length)];
}

// function generateAuthor() {
//   const authors = ['Author #1', 'Author #2', 'Author #3'];
//   const author =  authors[Math.floor(Math.random() * authors.length)];
//   return {
//     firstName: author.firstName,
//     lastName: author.lastName
//   };
// }

function generateAuthor() {
  const authors = ['Author #1', 'Author #2', 'Author #3'];
  return authors[Math.floor(Math.random() * authors.length)];
}


function generateBlogPostData() {
  return {
    title: generateTitle(),
    content: generateContent(),
    authorName: generateAuthor()
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Blog Posts API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBlogPostData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  //Get
  describe('GET endpoint', function() {
    it('should return all blog posts', function() {
      let res;
      // console.log(seedData);
      return chai.request(app)
        .get('/posts')
        .then(function(_res) {
          // console.log(_res.body);
          res = _res;
          console.log(res.body);
          res.status.should.be.equal(200);
          res.body.should.have.length.of.at.least(1);
          return BlogPost.count();
        })
        .then(function(count) {
          console.log(count);
          res.body.length.should.be.equal(count);
        });
    });

    it('should return blog posts with right fields', function() {
      let resPost;
      return chai.request(app)
        .get('/posts')
        .then(function(res) {
          res.status.should.be.equal(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
        
          res.body.forEach(function(blog) {
            blog.should.be.a('object');
            blog.should.include.keys('id', 'title', 'author', 'content', 'created');
          });
          resPost = res.body[0];
          return BlogPost.findById(resPost.id);
        })
        .then(function(blog) {
          blog.id.should.equal(resPost.id);
          blog.title.should.equal(resPost.title);
          blog.content.should.equal(resPost.content);
          blog.authorName.should.equal(resPost.author);
        });
    });
  });

  //Post
  describe('POST endpoint', function() {

  });

  //Put
  describe('PUT endpoint', function() {

  });

  //Delete

  describe('DELETE endpoint', function() {

  });
});
