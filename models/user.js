var Db = require('mongodb').Db
  , Connection = require('mongodb').Connection
  , Server = require('mongodb').Server
  , BSON = require('mongodb').BSON
  , ObjectID = require('mongodb').ObjectID
  , hasher = require('../lib/utils/hasher')
  ;

var UserModel = function (host, port) {

  this.server = new Server(host, port, {
      auto_reconnect: true
  }, {});
  this.db = new Db('OliverJAsh', this.server);

  this.db.open(function () {});

};

UserModel.prototype.getCollection = function (callback) {

  this.db.collection('users', function (error, users) {
    if (error) {
      callback(error);
    } else {
      callback(null, users);
    }
  });

};

UserModel.prototype.findAll = function (callback) {

  this.getCollection(function (error, users) {
    if (error) {
      callback(error);
    } else {
      users.find().toArray(function (error, users) {

        if (error) {
          callback(error);
        } else {
          callback(null, users);
        }

      });

    }
  });

};


UserModel.prototype.findById = function (id, callback) {

  this.getCollection(function (error, users) {
    if (error) {
      callback(error);
    } else {
      users.findOne({_id: users.db.bson_serializer.ObjectID.createFromHexString(id)}, function (error, result) {

        if (error) {
          callback(error);
        } else {
          callback(null, result);
        }

      });
    }
  });

};

UserModel.prototype.find = function (user, callback) {

  this.getCollection(function (error, users) {
    if (error) {
      callback(error);
    } else {
      users.findOne(user, function (error, result) {

        if (error) {
          callback(error);
        } else {
          callback(null, result);
        }

      });
    }
  });

};

UserModel.prototype.register = function (user, callback) {

  var self = this;

  this.find({
      user: user.username
  }, function (error, response) {
    if (error) {
      callback(error);
    }

    if (response) {
      callback(null, {
          success: false
        , error: 'User already exists'
      });

      return true;
    } else {
      // If this username is not taken, go ahead with the register
      self.getCollection(function (error, users) {
        if (error) {
          callback(error);
        } else {
          user.salt = 'h3';
          user.password = hasher.saltyHash(user.salt, user.password);

          users.insert(user, function () {
            callback(null, {
                success: true
              , user: user
            });
          });
        }
      });
    }
  });

};

UserModel.prototype.login = function (user, callback) {

  this.find({
      username: user.username
  }, function (error, response) {
    if (error) {
      callback(error);
    }

    if (response) {
      // Salt the inputted password and check it matches that in the database
      if (hasher.saltyHash(response.salt, user.password) === response.password) {
        callback(null, {
            success: true
          , user: response
        });
      } else {
        callback(null, {
            success: false
          , error: 'Incorrect password'
        });
      }
    } else {
      callback(null, {
          success: false
        , error: 'No user found'
      });
    }
  });

};

module.exports = UserModel;