var dir = {


    create: function (path, root) {
        var path = path.split('/');
        var create = root + '/';//初始值为静态物理路径
        for (i = 0; i < path.length; i++) {
            create += path[i] + '/';
            if (!fs.existsSync(create)) {
                fs.mkdirSync(create);
            }
        }

    },

}

module.exports = dir;