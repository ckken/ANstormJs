var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentScheme = new Schema({
    comment: String, ip: String, status: {type: Boolean, default: false}, creattime: {type: String, default: C.time()}, email: String, author: String, avatar: String
});

mongoose.model('Comment', CommentScheme);
var Comment = module.exports = mongoose.model('Comment');