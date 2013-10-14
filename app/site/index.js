var base = {

    init: function (req, res, next) {
        //console.log(C.root+'/static/view/index.html');
        res.render(C.root + '/static/view/index.html');
    }
}

module.exports = base;

