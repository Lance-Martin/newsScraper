
//===================================================
// ##########Dependencies#############
//===================================================
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

//===================================================
// #####Database configuration with mongoose######
//===================================================
mongoose.connect('mongodb://localhost/newsMachine');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});


// And bring in Comment and Article models
var Comments = require('../models/comments.js');
var Article = require('../models/articles.js');

//===================================================
//#################Routes#######################
//===================================================
router.get('/', function(req,res){
  Article.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		}
		// or send the doc to the browser as a json object
		else {
			res.render('index', doc);
		}
	});
});

router.get('/scrape', function(req,res){
  request("https://www.bbc.com/news", function (error, response, html) {
    if (error) throw error;
    console.log('have sent cheerio to the ny times');
  	// Load the html into cheerio and save it to a var.
    // '$' becomes a shorthand for cheerio's selector commands,
    //  much like jQuery's '$'.
    var $ = cheerio.load(html);

    // Select each instance of the html body that you want to scrape.
      var result = {};
      //console.log($('.theme-feature').html());
      result.title = $('.buzzard-item').find(' .title-link__title-text').text();
      result.link = "https://www.bbc/news"+$('.buzzard-item').find('.title-link').attr('href');
      result.summary = $('.buzzard__summary').text();
      console.log(result);
      var entry = new Article (result);

				// now, save that entry to the db
				entry.save(function(err, doc) {
					// log any errors
				  if (err) {
				    console.log(err);
				  }
				  // or log the doc
				  else {
				    console.log(doc);
				  }
				});
  });
  res.send('scraped');
  console.log("scraped");
});

router.get('/articles', function(req, res){
	// grab every doc in the Articles array
	Article.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		}
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

module.exports = router;
