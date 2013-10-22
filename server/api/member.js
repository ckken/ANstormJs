var o = require('./base');

o.login = function (req, res) {
    var _S = this;
    var name = ('undefined' !== typeof req.body.name) ? req.body.name : '';
    var password = ('undefined' !== typeof req.body.password) ? req.body.password : '';
    if (name != '' && !_S.Guser.login) {
        var where = {};
        where.$or = [
            {email: name},
            {name: name}
        ];
        where.password = _S.encode.md5(password);
        console.log(where);
        D.collection('members').findOne(where, function (err, data) {

            if (data != null) {
                var key = {name: data.name, email: data.email, uid: data.id, status: data.status};

                key = JSON.stringify(key);
                key = _S.encode.e(key);
                //保存登录
                var maxAgeCookie = ('undefined' !== typeof req.body.remember) ? C.maxAge : 0;

                res.cookie('user', key, { maxAge: C.maxAge, path: '/', signed: true});
                res.json({code: 0, data: data, tips: "登录成功"});
                var headers = req.headers;
                req.ip = headers['x-real-ip'] || headers['x-forwarded-for'] || req.ip;
                var d = {};
                d.logip = req.ip;
                D.collection('members').update(
                    {_id:data._id},
                    {$set: d},
                    function (err, row) {
                });


            }
            else {
                res.json({code: 1, tips: "帐号不存在或密码错误"});
            }
        })


    }
    else {
        res.json({code: 1, tips: "邮箱或者帐号名不能为空"});
    }


}

o.logout = function (req, res) {
    res.clearCookie('user', { path: '/' });
    this.Guser.login = false;
    //res.redirect('/member/gate/login/');
    res.json({code: 0, tips: "退出成功"});
}

o.register = function (req, res) {
    var _S = this;
    var d = {};
    d.name = ('undefined' !== typeof req.body.name) ? req.body.name : '';
    d.email = ('undefined' !== typeof req.body.email) ? req.body.email : '';
    d.password = ('undefined' !== typeof req.body.password) ? req.body.password : '';
    d.password = _S.encode.md5(d.password);
    if (d.name != '' || d.email != '') {
        D.collection('members').count({email: d.email}, function (err, count) {
            if (!count) {
                D.collection('members').count({name: d.name}, function (err, count) {
                    var data = d;
                    if (!count) {
                        D.collection('members').insert(d, function (err) {
                            // console.log(data);
                           // data.id = id;
                            data.status = 0;
                            var key = {name: data.name, email: data.email, uid: data._id, status: data.status};
                            console.log(key);
                            key = JSON.stringify(key);
                            key = _S.encode.e(key);
                            res.cookie('user', key, { maxAge: C.maxAge, path: '/', signed: true});
                            res.json({code: 0, data: data, tips: "注册成功，进行登录......"});

                            var headers = req.headers;
                            req.ip = headers['x-real-ip'] || headers['x-forwarded-for'] || req.ip;
                            var d = {};
                            d.logip = req.ip;
                            d.regip = req.ip;
                            D.collection('members').update(
                                {_id:data._id},
                                {$set: d},
                                function (err, row) {
                            });

                        });


                    }
                    else {
                        res.json({code: 1, tips: "用户名已经存在"});

                    }

                })


            }
            else {
                res.json({code: 1, tips: "邮箱已经存在"});
            }
        })


    }
    else {
        res.json({code: 1, tips: "邮箱或者帐号名不能为空"});
    }


}

o.changePassword = function (req, res) {
    var _S = this;
    var name = ('undefined' !== typeof req.body.name) ? req.body.name : '';
    var password = ('undefined' !== typeof req.body.password) ? req.body.password : '';
    var changepassword = ('undefined' !== typeof req.body.changepassword) ? req.body.changepassword : '';
    if (name != '') {
        var where = {};
        where.$or = [
            {email: name},
            {name: name}
        ];
        where.password = _S.encode.md5(password);

        D.collection('members').findOne(where, function (err, data) {

            if (data != null) {


                var headers = req.headers;
                req.ip = headers['x-real-ip'] || headers['x-forwarded-for'] || req.ip;
                var d = {};
                d.logip = req.ip;
                d.password = _S.encode.md5(changepassword);
                D.collection('members').update({_id: data._id}, d, function (err, row) {

                    res.json({code: 0, data: data, tips: "修改成功"});
                });


            }
            else {
                res.json({code: 1, tips: "密码错误 请重试"});
            }
        })
    }
}

/*o.checkLogin = function(req,res){
 var _S = this;
 var userstr = req.signedCookies.user;

 if('undefined'!==typeof userstr && userstr !='')
 {
 userstr = _S.encode.d(userstr);
 var user = eval('(' + userstr + ')');
 if('undefined'===typeof user)
 {
 //res.redirect('/member/gate/login/');
 res.json({code:1,data:"请登录"});
 return false;
 }
 else
 {
 user.avatar = _S.encode.md5(user.email);

 var headers = req.headers;
 user.ip = headers['x-real-ip'] || headers['x-forwarded-for']||req.ip;
 //console.log(headers);
 global.user = user;//模块全局
 //app.locals({user: user});//模版全局
 res.json({code:1,data:user});
 return true;
 }
 }
 else
 {
 //res.redirect('/member/gate/login/');
 res.json({code:1,data:"请登录"});
 return false;
 }

 }*/

module.exports = o;