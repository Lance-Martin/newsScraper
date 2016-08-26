
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
  res.render('index');
});

router.get('/scrape', function(req,res){
  request("https://www.bbc.com/news", function (error, response, html) {
    console.log("its scraping at least");
    if (error) throw error;
  	// Load the html into cheerio and save it to a var.
    // '$' becomes a shorthand for cheerio's selector commands,
    //  much like jQuery's '$'.
    var $ = cheerio.load(html);

    // Select each instance of the html body that you want to scrape.
      var result = {};
      //console.log($('.theme-feature').html());
      result.title = $('.buzzard-item').find(' .title-link__title-text').text();
      result.link = "https://www.bbc.com"+$('.buzzard-item').find('.title-link').attr('href');
      result.summary = $('.buzzard__summary').text();
      console.log(result);
      Article.findOne({'title': result.title}, function(err, doc){
        if (doc) {
          console.log("this article already exist and we cant be double adding to the database now can we?");
          res.send('alreadyFresh');
        }
        else {
          var entry = new Article (result);

    				// now, save that entry to the db
    				entry.save(function(err, doc) {
    					// log any errors
    				  if (err) {
    				    console.log(err);
    				  }
    				  // or log the doc
    				  else {
                console.log("scraped and added");
    				    //console.log(doc);
                res.send('reload');
    				  }
    				});
        }
      });
  });

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

router.get('/articles/:id', function(req, res){
	// using the id passed in the id parameter,
	// prepare a query that finds the matching one in our db...
	Article.findOne({'_id': req.params.id})
	// and populate all of the notes associated with it.
	.populate('comments')
	// now, execute our query
	.exec(function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		}
		// otherwise, send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

router.post('/articles/:id', function(req, res){
  console.log(req.body);
	// create a new comment and pass the req.body to the entry.
	var newComment = new Comments(req.body);

	// and save the new note the db
	newComment.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		}
		// otherwise
		else {
      console.log(doc);
      res.send(doc);
			// using the Article id passed in the id parameter of our url,
			// prepare a query that finds the matching Article in our db
			// and update it to make it's lone comment the one we just saved
			Article.findOneAndUpdate({'_id': req.params.id}, {'comments':doc._id}, {new: true})
			// execute the above query
			.exec(function(err, obj){
				// log any errors
				if (err){
					console.log(err);
				} else {
          //console.log(obj);
				}
			});
		}
	});
});

router.post('/delete/:id', function(req, res){
  console.log("delete route hit");
  console.log(req.body.commentID);
  Article.findOneAndUpdate({'_id': req.params.id},{'comments': null}, function(err, doc){
    if (err){
      console.log(err);
    } else {
      //console.log(doc);
    }

  });
  Comments.remove({'_id': req.body.commentID},function(err){
    if (err) throw err;
    console.log('removed');
    res.send('removed');
  });

});

module.exports = router;
