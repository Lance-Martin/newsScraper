var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articlesSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  comments: {
      type: Schema.Types.ObjectId,
      ref: 'comments'
  }
});

var Article = mongoose.model('Article', articlesSchema);

module.exports = Article;
