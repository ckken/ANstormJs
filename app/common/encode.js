var crypto = require('crypto');
var encode = {



    md5: function (text) {
        return crypto.createHash('md5').update(text).digest('hex');
    },


    d: function (crypted) {

        var decipher = crypto.createDecipher('aes-256-cbc', C.secret);
        var dec = decipher.update(crypted, 'hex', 'utf8')
        dec += decipher.final('utf8')
        return dec;
    },

    e: function (text) {

        var cipher = crypto.createCipher('aes-256-cbc', C.secret);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
}

module.exports = encode;