var UserModel = require('../models/user')
  , ArticleModel = require('../models/article')
  , moment = require('../lib/moment')
  ;

var userModel = new UserModel('localhost', 27017)
  , articleModel = new ArticleModel('localhost', 27017)
  ;

module.exports = function (app) {

  app.get('/:year/:month/:slug', function (request, response) {
    var year = parseInt(request.params.year, 10)
      , month = (parseInt(request.params.month, 10) - 1)
      ;

    articleModel.find(
      { created_at:
        { $gte: new Date(year, month)
        , $lt: new Date(year, (month + 1))
        }
      , slug: request.params.slug
      },
    function (error, article) {
      response.render('article.jade',
        { title: article.title
        , article: article
        }
      );
    });
  });

};