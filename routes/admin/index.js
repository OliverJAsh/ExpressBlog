var UserModel = require('../../models/user')
  , ArticleModel = require('../../models/article')
  ;

var userModel = new UserModel('localhost', 27017)
  , articleModel = new ArticleModel('localhost', 27017)
  ;

module.exports = function (app) {

  app.get('/admin/', app.authenticateUser, function (request, response) {
    articleModel.findAll(function (error, articles) {
      response.render('admin/index.jade',
        { title: 'Admin Area'
        , user: request.session.user
        , articles: articles
      });
    });
  });

};