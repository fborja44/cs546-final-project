// Require each of the routes
const usersRoutes = require('./users');
const gamesRoutes = require('./games');

const path = require('path');

// Put all the routes together
const constructorMethod = (app) => {
  app.use('/games', gamesRoutes);
  app.use('/users', usersRoutes);

  // Homepage
  app.use('/', (req, res) => {
    res.sendFile(path.resolve('static/home.html'));
  });

  // Catch all method
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found.' });
  });
};

module.exports = constructorMethod;
