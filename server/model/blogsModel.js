var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var BlogScheme = new Schema({
    title:String
    ,content:String
    ,pic:String
    ,ip:String
    ,tags:[]
    ,status:{type:Boolean,default:false}
    ,creattime:{type:String,default:F.date.time()}
    ,updatetime:{type:String,default:F.date.time()}
    ,email:String
    ,author:String
    ,view:{type:Number,default:0}
    , meta      : {
            votes : {type:Number,default:0}
          , favs  : {type:Number,default:0}
        }
});

module.exports = mongoose.model('Blog', BlogScheme);
