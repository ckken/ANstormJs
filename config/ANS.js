var ANS  ={
    init: function (root) {
        this.conf = root + "/config";
        global.C = require(this.conf+'/config').init(root);
        global.M = {};
        M.express = require('express');
        //M.mongoskin = require('mongoskin');//mongo
        M.nodemailer = require('nodemailer');//邮件
        global.Q = require('q');//延迟执行
        //global.when = require('when');//延迟执行
        global.F = {};
        this.fpath = root + "/lib/function";
        F.pageNavi = require(this.fpath + '/pageNavi');
        F.date = require(this.fpath + '/date');
        F.dir = require(this.fpath + '/dir');
        F.email = require(this.fpath + '/email');
        F.encode = require(this.fpath + '/encode');
        F.html = require(this.fpath + '/html');
        F.msg = require(this.fpath + '/msg');
        F.upload = require(this.fpath + '/upload');;
        //init config
        this.express();
        console.log('the ANS has run on service:'+C.port);
    },

    express:function(){
        var app = require(this.conf + '/express').init();
        require(this.conf+'/route').init(app);
        this.mongo(app);
        require('http').createServer(app).listen(C.port, function () {
        });
    },

    mongo:function(app){
        var mongoose = require('mongoose');
        mongoose.connect(C.mongodb);
        app.on('close', function(err) {
            mongoose.disconnect(callback);
        });

        global.D = require(C.model + '/db');

    }

}

module.exports = ANS;
