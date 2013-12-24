var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Scheme = new Schema({
    tags:String
    ,author:String
    ,email:String
    ,ip:String
});

module.exports = mongoose.model('Tag', Scheme);