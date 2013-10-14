var util = require('util');
var msg = {


    bug: function (rs) {
        util.log(rs);
    },

    dump: function (obj) {
        console.log(obj);
    }
}


module.exports = msg;