var UserModel = require('../../models/user')
  , ArticleModel = require('../../models/article')
  , moment = require('../../lib/moment')
  ;

var userModel = new UserModel('localhost', 27017)
  , articleModel = new ArticleModel('localhost', 27017)
  ;

module.exports = function (app) {

  app.get('/admin/edit-article/:year/:month/:slug', function (request, response) {
    var startDate = moment(request.params.year + ' ' + request.params.month)
      ;

    articleModel.find(
      { created_at:
        { $gte: startDate.toDate()
        , $lte: moment(startDate).add('M', 1).subtract('d', 1).toDate()
        }
      , slug: request.params.slug
      },
    function (error, article) {
      response.render('admin/edit-article.jade',
        { title: article.title
        , article: article
        }
      );
    });
  });

  app.post('/admin/edit-article/*', function (request, response) {
    articleModel.update(request.body.article, function () {
      response.end();
    });

  });

};