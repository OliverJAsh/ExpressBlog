var util = require('util')
  , UserModel = require('../models/user')
  , ArticleModel = require('../models/article')
  ;

var userModel = new UserModel('localhost', 27017)
  , articleModel = new ArticleModel('localhost', 27017)
  ;

module.exports = function (app) {

  app.get('/login', function (request, response, next) {
    if (request.session.user) {
      response.redirect('/');
    } else {
      next();
    }
  }, function (request, response) {
    userModel.findAll(function (error, users) {
      if (!users.length) {
        response.redirect('/register');
      } else {
        response.render('login.jade',
          { title: 'Login' }
        );
      }
    });
  });

  app.post('/login', function (request, response) {
    userModel.login({
        username: request.param('username')
      , password: request.param('password')
    }, function (error, result) {
      if (result.success) {
        request.session.user = result.user;

        response.redirect('/admin/');
      } else {
        response.render('login.jade',
          { title: 'Login'
          , error: result.error
          }
        );
      }
    });
  });

}