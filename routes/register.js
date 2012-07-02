var util = require('util')
  , UserModel = require('../models/user')
  , ArticleModel = require('../models/article')
  ;

var userModel = new UserModel('localhost', 27017)
  , articleModel = new ArticleModel('localhost', 27017)
  ;

module.exports = function (app) {

  app.get('/register', app.authenticateUser, function (request, response) {
    response.render('register.jade', {
        title: 'Register'
    });
  });

  app.post('/register', function (request, response) {
    userModel.register({
        username: request.param('username')
      , password: request.param('password')
    }, function (error, result) {
      if (result.success) {
        request.session.user = result.user;
      }

      response.redirect('/');
    });
  });

};