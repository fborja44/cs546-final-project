const express = require('express');
const session = require('express-session');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const chalk = require('chalk'); // add colors to output for easier reading

const mongoCollections = require('./config/mongoCollections');
const dbConnection = require('./config/mongoConnection');
const games = mongoCollections.games;

const data = require('./data/');
const usersData = data.users;
const gamesData = data.games;
const reviewsData = data.reviews;

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  }
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use;
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

// Handlebars helpers
/**
 * Handlebars helper for string replacement
 * Source: https://stackoverflow.com/questions/52570039/remove-white-space-between-words-in-a-handlebar-expression
 */
// handlebarsInstance.handlebars.registerHelper('replace', function(string, search, replace) {
//   return string.replace(search, replace);
// });

/**
 * Handlebars helper to retrieve game using id
 * note: doesn't display properly on webpage since asynchronous and results in a promise
 * but the result is correct
 */
// handlebarsInstance.handlebars.registerHelper('getGameById', async function(gameId) {
//   try {
//     let game = await gamesData.getGameById(gameId.toString());
//     console.log(game.title);
//     return game.title;
//   } catch (e) {
//     return "Failed to get game title";
//   }
// });

// Create session
app.use(session({
  name: 'AuthCookie',
  secret: 'super secret',
  resave: false,
  saveUninitialized: true
}))

app.use(async (req, res, next) => {
  if (!req.session.user_id) {
    req.body.signed_in = false;
    next();
  } else {
    req.body.signed_in = true;
    next();
  }
})

/**
 * Logging Middleware to help with debugging routes
 * Logs the following information:
 * - Current Timestamp
 * - Request Method
 * - Request Route
 * - Whether the user is authenticated (temporaryily disabled)
 */
 app.use(async (req, res, next) => {
  let curr_time = new Date().toUTCString();
  let method = req.method;
  let route = req.originalUrl;
  let auth;
  if (req.session.user_id) {
      auth = chalk.green("(Authenticated User)");
  } else {
      auth = chalk.red("(Non-Authenticated User)");
  }
  console.log(chalk.gray(`[${curr_time}]: `) + `${method} ` + chalk.yellow(`${route} `) + auth);

  next();
});

// Database
const init_db = async () => {
  const gamesCollection = await games();
  gamesCollection.createIndex( { title: "text" } );
}

init_db().catch(console.log);


configRoutes(app);

app.listen(3000, () => {
    console.log(chalk.cyan("============================================================================="));
    console.log(chalk.gray("             CS-546 Final Project: Video Game Review Application             "));
    console.log(chalk.gray("   Group 37: Francis Borja, Eunso Brian Lee, Bingxin Xia, and Naomi Zheng   "));
    console.log(chalk.green("                 Server is running on http://localhost:3000                 "));
    console.log(chalk.cyan("============================================================================="));
});
