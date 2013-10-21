var route = module.exports = {};

route.init = function (app) {
    //路由
    //有参数传递
    app.all('/api/:module/:action/*', function (req, res, next) {

        var list = req.params[0], list = list.split('/'), data = {};
        for (i = 0; i < Math.ceil(list.length / 2); i++) {
            data[list[i * 2]] = list[i * 2 + 1];
        }
        C.route = {};
        var m = req.params.module, a = req.params.action;
        C.route.m = m, C.route.a = a;
        req.xdata = data;

        require(C.config.app + '/api/' + m)['init'](req, res, next, a);


    });


    //默认连接
    app.get('/*', function (req, res, next) {
        require(C.config.app + '/index')['init'](req, res, next);
    });


    //404
    /*app.get('/*',function(req,res){
     return res.render(C.config..view+'/error.html', {message: '404'});
     });*/


}