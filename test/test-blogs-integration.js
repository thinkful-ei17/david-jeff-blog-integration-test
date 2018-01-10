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

//Seeding data
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
//   return authors[Math.floor(Math.random() * authors.length)];
// }

// function generateAuthor() {
//   const authors = ['Author #1', 'Author #2', 'Author #3'];
//   const author = authors[Math.floor(Math.random() * authors.length)];
//   return {
//     firstName: author.firstName,
//     lastName: author.lastName
//   };
// }

function generateFirstName() {
  const firstNames = ['firstName1', 'firstName2', 'firstName3'];
  return firstNames[Math.floor(Math.random() * firstNames.length)];
}

function generateLastName() {
  const lastNames = ['lastName1', 'lastName2', 'lastName3'];
  return lastNames[Math.floor(Math.random() * lastNames.length)];
}

function generateBlogPostData() {
  return {
    title: generateTitle(),
    content: generateContent(),
    author: {
      firstName: generateFirstName(),
      lastName: generateLastName()
    }
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
          res = _res;
          res.status.should.be.equal(200);
          res.body.should.have.length.of.at.least(1);
          return BlogPost.count();
        })
        .then(function(count) {
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
    it('should add a new blog post', function() {
      const newBlogPost = generateBlogPostData(); 
      // console.log(newBlogPost);
      return chai.request(app)
        .post('/posts')
        .send(newBlogPost)
        .then(function(res) {
          res.status.should.be.equal(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'title', 'author', 'content', 'created');
          res.body.title.should.equal(newBlogPost.title);
          res.body.content.should.equal(newBlogPost.content);
          res.body.author.should.equal(newBlogPost.author.firstName + ' ' + newBlogPost.author.lastName);          
          res.body.id.should.not.be.null;
          return BlogPost.findById(res.body.id);
        })
        .then(function(blog) {
          console.log(blog.author);
          console.log(newBlogPost.author);
          blog.title.should.equal(newBlogPost.title);
          blog.content.should.equal(newBlogPost.content);
          blog.author.firstName.should.equal(newBlogPost.author.firstName);
          blog.author.lastName.should.equal(newBlogPost.author.lastName);
        });
    });
  });

  //Put
  describe('PUT endpoint', function() {
    it('should update field you send over', function() {
      const updateData = {
        title: 'new title',
        content: 'new content'
      };

      return BlogPost
        .findOne()
        .then(function(blog) {
          updateData.id = blog.id;

          return chai.request(app)
            .put(`/posts/${blog.id}`)
            .send(updateData);
        })
        .then(function(res) {
          res.status.should.be.equal(204);

          return BlogPost.findById(updateData.id);
        })
        .then(function(blog) {
          blog.title.should.equal(updateData.title);
          blog.content.should.equal(updateData.content);
        });
    });
  });

  //Delete

  describe('DELETE endpoint', function() {
    it('should delete a restaurant by id', function() {
      let blog;

      return BlogPost
        .findOne()
        .then(function(_blog) {
          blog = _blog;
          return chai.request(app).delete(`/posts/${blog.id}`);
        })
        .then(function(res) {
          res.status.should.be.equal(204);
          return BlogPost.findById(blog.id);
        })
        .then(function(_blog) {
          expect(_blog).to.be.null;
        });
    });
  });
});
