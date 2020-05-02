const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const csrf = require('csurf');
const csrfProtection = csrf({});
const config = require('./config/config.json');
const app = express();
const port = 3000;



//   Sessions
app.use(session({secret: config.secret,saveUninitialized: true,resave: true}));


//   Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

//   Static
app.use(express.static(__dirname + '/public'));

// CSRF Protected Middleware
app.use(csrfProtection);



//  Templating Middleware
app.set('view engine', 'ejs');
app.set('views', 'views');


//   DB
const connectDB = require('./config/db.js');
connectDB();

//   CSRF for every request
app.use(function (req, res, next){
  res.locals.csrfToken = req.csrfToken();
  next();
});

//   Routes
const mainRoutes = require('./routes/mainroutes.js');
app.use('/', mainRoutes);






app.use((req, res, next) => {
	res.status(404).render('404', {title: "404 Page"});
  });


//   Run Server
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));