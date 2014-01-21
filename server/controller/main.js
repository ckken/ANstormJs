var o = require('./base');

o.config = function (req, res) {
    var _S = this;
    var config = {};
    var userstr = req.signedCookies.user;
    if ('undefined' !== typeof userstr && userstr != '') {
        userstr = F.encode.d(userstr);
        config.user = eval('(' + userstr + ')');
        config.user.avatar = F.encode.md5(config.user.email);
    }

    res.json(config);

}

o.tagsList = function(req, res){
    var _S = this;
    var tagsList = {};
    op = {email:_S.Guser.email};
    D('tags').find(op).exec(function (err, tagsList) {
        res.json(tagsList);
    });
}

module.exports = o;