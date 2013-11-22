var ANS  ={
    init: function (root) {
        this.root = root;
        global.C = require(root + "/ANS/config").init(root);
        M = {};
        M.express = require('express');
        M.mongoskin = require('mongoskin');
        M.nodemailer = require('nodemailer');
        M.thenjs = require('thenjs');
        var libpath = root + '/ANS/lib/';
        F = {};
        F.pageNavi = require(libpath + '/pageNavi');
        F.date = require(libpath + '/date');
        F.dir = require(libpath + '/dir');
        F.email = require(libpath + '/email');
        F.encode = require(libpath + '/encode');
        F.html = require(libpath + '/html');
        F.msg = require(libpath + '/msg');
        F.upload = require(libpath + '/upload');
        //init config
        this.express();
    },

    express:function(){
        var app = require(this.root + '/ANS/mod/express').init();
        require(this.root+'/ANS/mod/route').init(app);
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
