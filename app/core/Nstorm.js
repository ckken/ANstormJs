var Nstorm = {
    init: function (root) {

        this.action = __dirname + '/action';
        this.model = __dirname + '/model';
        this.conf = __dirname + '/config';

        this.root = root;
        this.config();
        this.app = this.express();
        this.route();
        this.mongodb();
        this.http();


    },

    config: function () {
        return global.C = require(this.root + "/app/conf/config").init(this.root);
    },

    express: function () {
        //express init
        var app = require(this.conf + "/express").init();
        return app;

    },

    route: function () {
        //路由定义
        var route = require(this.conf + "/route").init(this.app);
        return route;
    },

    mongodb: function () {
        //建立链接DB //初始化 model层
        var MongoDb = require(this.model + "/mongodbConnect").init(this.app);
        global.D = require(this.model + '/db');
        return MongoDb;
    },
    http: function () {
        //HTTP端口
        var http = require('http').createServer(this.app).listen(C.port, function () {
        });
        return http;
    }

}

module.exports = Nstorm;