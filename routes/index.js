var UserModel = require('../models/user')
  , ArticleModel = require('../models/article')
  ;

var userModel = new UserModel('localhost', 27017)
  , articleModel = new ArticleModel('localhost', 27017)
  ;

module.exports = function (app) {

  app.get('/', function (request, response) {
    articleModel.findAll(function (error, articles) {
      response.render('index.jade',
        { title: 'Oliver J. Ash'
        , user: request.session.user
        , articles: articles
      });
    });
  });

};