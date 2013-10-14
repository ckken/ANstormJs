var base = {

//blogDB : require(C.model+'/blogModel'),
//memberDB : require(C.model+'/member'),
    pN: require(C.common + '/pageNavi'),
    Up: require(C.common + '/upload'),
    date: require(C.common + '/date'),
    encode: require(C.common + '/encode'),
    html: require(C.common + '/html'),
    Guser: {},


    init: function (req, res, next, a) {
        var _S = this;
        if ('function' !== typeof _S[a])next();
        else {
            _S.checkLogin(req, res);
            _S[a](req, res, next);
        }

    },

    checkLogin: function (req, res) {
        var _S = this;
        var userstr = req.signedCookies.user;

        if ('undefined' !== typeof userstr && userstr != '') {
            userstr = _S.encode.d(userstr);
            var user = eval('(' + userstr + ')');
            if ('undefined' === typeof user) {
                //res.redirect('/member/gate/login/');
                return false;
            }
            else {
                user.avatar = _S.encode.md5(user.email);

                var headers = req.headers;
                user.ip = headers['x-real-ip'] || headers['x-forwarded-for'] || req.ip;
                //console.log(headers);
                //global.user = user;//模块全局
                //app.locals({user: user});//模版全局
                _S.Guser = user;
                _S.Guser.login = true;
                _S.Guser.admin = false;
                if (user.email == 'ckken@qq.com')_S.Guser.isAdmin = true;
                return true;
            }
        }
        else {
            //res.redirect('/member/gate/login/');
            return false;
        }

    }

    /*userList : function(req,res,callback){
     var where = {};
     var _S = this;
     // where.postnum ={$gt:0};
     where.status =true;
     var bysort = {'_id':-1};
     var limit = 28;

     //_S.memberDB.findAll(where,28,bysort,function(data){
     D('Member').model().find(where).sort(bysort).limit(limit).exec(function(err,data){

     data.forEach(function(vo){
     vo.avatar = _S.encode.md5(vo.email);
     vo.createtime = _S.date.dgm(vo.createtime,'yyyy-mm-dd hh:ii:ss');
     vo.logintime = _S.date.dgm(vo.logintime,'yyyy-mm-dd hh:ii:ss');
     })

     D('Member').count({},function(err,count){

     global.userdata = data;//模块全局
     global.usernum = count;
     callback(1);
     })

     //app.locals({userdata: data});//模版全局

     });

     }*/





}

module.exports = base;

