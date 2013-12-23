var config = module.exports = {};

config.init = function (path) {
    var date = new Date();
    var root = path;
    var app = root + '/server';
    var conf = {
        debug: false,
        port: 100,
        email: 'ckken@qq.com',
        site_name: 'NodeJs开发社区',
        site_desc: '研究nodejs方向',
        session_secret: 'KenzRSecret',
        secret: 'KensSecret',
        mongodb: 'mongodb://ken:666666@wvovo.com:27017/ANstormjs',
        maxAge: 259200000,
        version: '0.0.1',
        //path
        root: root,
        static: root + '/client',
        app: app,
        view: app + '/view',
        model: app + '/model',
        time: Math.round(date.getTime() / 1000),//当前时间
        //favicon 基于client
        favicon: '/favicon.ico'

    }

    return conf;
}
