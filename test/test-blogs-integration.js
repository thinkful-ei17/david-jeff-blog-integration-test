'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should;

const {BlogPost} = require('../models');
const {runServer, app, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {seedData} = require('../seed-data');

chai.use(chaiHttp);

//Seeding data goes here

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Blog Posts API resource', function() {


  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return BlogPost.insertMany(seedData);
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  //Get
  describe('GET endpoint', function() {

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




