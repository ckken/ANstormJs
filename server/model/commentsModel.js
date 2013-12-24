var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    _id     :Object
  , name    :String
  , email   :String
  , comment :String
  , date    :{type:String,default: F.date.time()}
});

module.exports = mongoose.model('Comment', CommentScheme);
