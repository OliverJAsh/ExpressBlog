module.exports = function (app) {

  app.get('/logout', function (request, response) {
    if (response) {
      delete request.session.user;
    }

    response.redirect('/');
  });

};