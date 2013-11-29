var ANS  ={
    init: function (root) {
        this.conf = root + "/server/conf";
        global.C = require(this.conf+'/config').init(root);
        M = {};
        M.express = require('express');
        M.mongoskin = require('mongoskin');
        M.nodemailer = require('nodemailer');
        M.thenjs = require('thenjs');
        F = {};
        this.fpath = root + "/server/function";
        F.pageNavi = require(this.fpath + '/pageNavi');
        F.date = require(this.fpath + '/date');
        F.dir = require(this.fpath + '/dir');
        F.email = require(this.fpath + '/email');
        F.encode = require(this.fpath + '/encode');
        F.html = require(this.fpath + '/html');
        F.msg = require(this.fpath + '/msg');
        F.upload = require(this.fpath + '/upload');
        //init config
        this.express();
    },

    express:function(){
        var app = require(this.conf + '/express').init();
        require(this.conf+'/route').init(app);
        this.mongo(app);
        require('http').createServer(app).listen(C.port, function () {
        });
    },

    mongo:function(app){
        var mongo = M.mongoskin;
        global.D = mongo.db(C.mongodb,{safe:false});

        app.on('close', function (err) {
            mongo.close();
        });
    }

}

module.exports = ANS;
