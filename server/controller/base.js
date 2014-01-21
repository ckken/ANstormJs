var base = {

    Guser: {},

    init: function (req, res, next, a) {
        var _S = this;
        if ('function' !== typeof _S[a])next();
        else {
            _S.checkLogin(req, res,function(){
                _S[a](req, res, next);
            });
        }

    },

    checkLogin: function (req, res,callback) {
        var _S = this;
        var userstr = req.signedCookies.user;

        if ('undefined' !== typeof userstr && userstr != '') {
            userstr = _S.encode.d(userstr);
            var user = eval('(' + userstr + ')');
            if ('undefined' === typeof user) {
                return false;
            }
            else {
                user.avatar = _S.encode.md5(user.email);

                var headers = req.headers;
                user.ip = headers['x-real-ip'] || headers['x-forwarded-for'] || req.ip;
                _S.Guser = user;

            }
        }
        callback();
    }
}

module.exports = base;

