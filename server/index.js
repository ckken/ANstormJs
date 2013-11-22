var base = {

    init: function (req, res, next) {
        res.render(C.static + '/view/index.html');
    }
}

module.exports = base;

