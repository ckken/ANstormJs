var ANS  ={
    init: function (root) {
        this.root = root;
        global.C = {};
        C.config = require(root + "/ANS/conf/config").init(root);
        C.mod = {};
        C.mod.express = require('express');
        C.mod.mongoskin = require('mongoskin');
        C.mod.nodemailer = require('nodemailer');
        C.mod.thenjs = require('thenjs');
        var libpath = root + '/ANS/lib/';
        C.lib = {};
        C.lib.pageNavi = require(libpath + '/pageNavi');
        C.lib.date = require(libpath + '/date');
        C.lib.dir = require(libpath + '/dir');
        C.lib.email = require(libpath + '/email');
        C.lib.encode = require(libpath + '/encode');
        C.lib.html = require(libpath + '/html');
        C.lib.msg = require(libpath + '/msg');
        C.lib.upload = require(libpath + '/upload');
        //init config
        this.express();
    },

    express:function(){
        var app = require(this.root + '/ANS/conf/express').init();
        require(this.root+'/ANS/conf/route').init(app);
        this.mongo(app);
        require('http').createServer(app).listen(C.config.port, function () {
        });
    },

    mongo:function(app){
        var mongo = C.mod.mongoskin;
        global.D = mongo.db(C.config.mongodb);

        app.on('close', function (err) {
          mongo.close();
        });

    }

}

module.exports = ANS;
