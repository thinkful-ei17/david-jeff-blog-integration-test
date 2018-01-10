'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should;

const {BlogPost} = require('../models');
const {runServer, app, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

//Seeding data goes here



function seedBlogPostData() {
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateBlogPostData());

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

function generateAuthor() {
  const authors = ['Author #1', 'Author #2', 'Author #3'];
  return authors[Math.floor(Math.random() * authors.length)];
}

function generateBlogPostData() {
  return {
    title: generateTitle(),
    content: generateContent(),
    author: generateAuthor()
  }
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
    return seedData;
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
      console.log(seedData);
      return chai.request(app)
        .get('/posts')
        .then(function(_res) {
          console.log(_res);
          res = _res;
          res.should.have.status(200);
          (res.body.posts).should.have.length.of.at.least(1);
          return seedData.count();
        })
        .then(function(count) {
          (res.body.posts).should.have.length.of(count);
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




