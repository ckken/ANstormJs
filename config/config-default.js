var config = module.exports = {};

config.init = function (path) {
    var root = path;
    var app = root + '/server';
    var conf = {
        debug: false,
        port: 100,
        email: 'ckken@qq.com',
        site_name: 'NodeJs开发社区',
        site_desc: '研究nodejs方向',
        session_secret: 'KenzRSecret',
        secret: 'Secret',
        mongodb: 'mongodb://',
        maxAge: 259200000,
        version: '0.0.1',
        //path
        root: root,
        static: root + '/client',
        app: app,
        controller:app + '/controller',
        view: app + '/view',
        model: app + '/model',
        //favicon 基于client
        favicon: '/favicon.ico'
    }

    return conf;
}
