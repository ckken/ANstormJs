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
        staticUrl: '',
        surl: '',//css images js url
        purl: '',//data images url
        app: app,
        static: root + '/client',
        common: root + '/ANS/lib',
        view: app + '/view/default',
        model: app + '/model',
        //action: app + '/action',
        //site: app + '/site',

        //global function
//        time: function () {
//            return Math.round(date.getTime() / 1000)
//        },
        now: Math.round(date.getTime() / 1000)

    }

    return conf;
}
