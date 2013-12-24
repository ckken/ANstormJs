var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Scheme = new Schema({ 
	name:String
	,password:String
	,email:String
	,regip:String
	,logip:String
    ,status:{type:Boolean,default:false}
    ,createtime:{type:String,default:F.date.time()}
	,logintime:{type:String,default:F.date.time()}
    ,postnum:{type:Number,default:0}
});

module.exports = mongoose.model('Member', Scheme);
