var base = {

    init: function (req, res, next) {
        res.render(C.config.static + '/view/index.html');
    }
}

module.exports = base;

