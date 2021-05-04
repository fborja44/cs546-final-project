// Require each of the routes
const usersRoutes = require('./users');
const gamesRoutes = require('./games');

const path = require('path');

// Put all the routes together
const constructorMethod = (app) => {
  app.use('/games', gamesRoutes);
  app.use('/', usersRoutes);

  // Catch all method
  app.use('*', (req, res) => {
      res.status(404).render('general/error', { status: 404, error: 'Route not found.' });
  });
};

module.exports = constructorMethod;
