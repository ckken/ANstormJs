var o = require('./base');

o.config = function (req, res) {
    var _S = this;
    var config = {};
    var userstr = req.signedCookies.user;
    if ('undefined' !== typeof userstr && userstr != '') {
        userstr = _S.encode.d(userstr);
        config.user = eval('(' + userstr + ')');
        config.user.avatar = _S.encode.md5(config.user.email);
    }

    res.json(config);

}

module.exports = o;