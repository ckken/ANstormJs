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

o.tagsList = function(req, res){
    var _S = this;
    var tagsList = {};
    op = {email:_S.Guser.email};
    D.collection('tags').find(op).toArray(function (err, tagsList) {
        res.json(tagsList);
    });
}

module.exports = o;