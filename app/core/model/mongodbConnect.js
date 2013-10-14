var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.init = function (app) {
    exports.connect(function (err) {
        if (err) throw err;
    });
    //关闭链接时
    app.on('close', function (err) {
        exports.disconnect(function (err) {
        });
    });
}

exports.connect = function (callback) {
    mongoose.connect(C.Mongodb);
}

exports.disconnect = function (callback) {
    mongoose.disconnect(callback);
}

exports.setup = function (callback) {
    callback(null);
}