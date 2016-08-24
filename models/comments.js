var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  body: {
    type: String,
    required: true
  }
});

var comments = mongoose.model('comments', commentSchema);

module.exports = comments;
