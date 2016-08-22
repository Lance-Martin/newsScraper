var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

router.use('/', function(req,res){
  res.render('index');
});



module.exports = router;
