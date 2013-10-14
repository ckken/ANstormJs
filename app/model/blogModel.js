var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BlogScheme = new Schema({
    title: String, content: String, pic: String, ip: String, status: {type: Boolean, default: false}, creattime: {type: String, default: C.time()}, updatetime: {type: String, default: C.time()}, email: String, author: String, avatar: String, view: {type: Number, default: 0}, commentnum: {type: Number, default: 0}, tags: [], refer: String
});

mongoose.model('Blog', BlogScheme);
var Blog = module.exports = mongoose.model('Blog');