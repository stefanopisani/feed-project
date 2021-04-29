require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const helpers = require('handlebars-helpers');

hbs.registerHelper(helpers());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());


//Express session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    sameSite: true,
    httpOnly: true,
    maxAge: 600000 // ms = 1min
  },
  rolling: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 86400 // mins = 24hrs
  })
}))

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'logo-idea.png')));



// default value for title local
app.locals.title = 'Feed - food made social';

const index = require('./routes/index');
app.use('/', index);

const recipe = require('./routes/recipe');
app.use('/', recipe);

const auth = require('./routes/auth');
app.use('/', auth);

module.exports = app;