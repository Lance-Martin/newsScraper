var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');

//serve static content from the public folder
app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({
	extended: false
}));


//Tell express to use handlebars as the templating engine and to use main.handlebars as the default layout page
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//require the routes from the controller file
var routes = require('./controllers/controller.js');
app.use('/', routes);

//Tell the app to listen on port 5000.
var PORT = process.env.PORT || 5000;
app.listen(PORT, function(){
  console.log("listening on port: "+ PORT);
});
