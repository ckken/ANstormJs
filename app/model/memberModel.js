var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MemberScheme = new Schema({
    name: String, password: String, email: String, regip: String, logip: String, status: {type: Boolean, default: false}, createtime: {type: String, default: C.time()}, logintime: {type: String, default: C.time()}, postnum: {type: Number, default: 0}, avatar: String
});

mongoose.model('Member', MemberScheme);
var Member = module.exports = mongoose.model('Member');