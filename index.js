const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;



//   Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

//   Static
app.use(express.static(__dirname + '/public'));



//  Templating Middleware
app.set('view engine', 'ejs');
app.set('views', 'views');


//   DB
const connectDB = require('./config/db.js');
connectDB();


//   Routes
const mainRoutes = require('./routes/mainroutes.js');
app.use('/', mainRoutes);



app.use((req, res, next) => {
	res.status(404).render('404', {title: "404 Page"});
  });


//   Run Server
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));