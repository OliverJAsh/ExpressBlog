var Db = require('mongodb').Db
  , Connection = require('mongodb').Connection
  , Server = require('mongodb').Server
  , BSON = require('mongodb').BSON
  , ObjectID = require('mongodb').ObjectID
  , crypto = require('crypto')
  ;

function saltyHash(salt, value) {
  return crypto.createHash('sha1').update(salt + value).digest('hex');
}

var ArticleModel = function (host, port) {

  this.server = new Server(host, port, {
      auto_reconnect: true
  }, {});
  this.db = new Db('OliverJAsh', this.server);

  var self = this;

  this.db.open(function (error, connection) {
    self.connection = connection;
  });
};

ArticleModel.prototype.getCollection = function (callback) {

  this.db.collection('articles', function (error, articles) {
    if (error) {
      callback(error);
    } else {
      callback(null, articles);
    }
  });

};

ArticleModel.prototype.findAll = function (callback) {

  this.getCollection(function (error, articles) {
    if (error) {
      callback(error);
    } else {
      articles.find().toArray(function (error, articles) {

        if (error) {
          callback(error);
        } else {
          callback(null, articles);
        }

      });

    }
  });

};

ArticleModel.prototype.find = function (article, callback) {

  this.getCollection(function (error, articles) {
    if (error) {
      callback(error);
    } else {
      articles.findOne(article, function (error, result) {

        if (error) {
          callback(error);
        } else {
          callback(null, result);
        }

      });
    }
  });

};

ArticleModel.prototype.create = function (article, callback) {

  this.getCollection(function (error, articles) {
    if (error) {
      callback(error);
    } else {
      article.created_at = new Date();

      articles.insert(article, function () {
        callback(null, article);
      });
    }
  });

};

ArticleModel.prototype.update = function (article, callback) {

  var self = this;

  this.getCollection(function (error, articles) {
    if (error) {
      callback(error);
    } else {
      // We can't edit the article with the ID assigned, so we convert it to a
      // Mongo ID and then delete it from the object.
      var id = self.connection.bson_serializer.ObjectID(article._id);
      delete article._id;

      articles.update({ _id: id }, { $set: article }, { safe: true }, function (error) {
        console.log(error);

        callback(null, article);
      });
    }
  });

};

module.exports = ArticleModel;