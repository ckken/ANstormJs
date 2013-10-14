var fs = require('fs');
var upload = {

    init: function (files, Dirpath) {
        // 移动文件需要使用fs模块
        Dirpath = ('undefined' != typeof Dirpath) ? Dirpath : 'images';
        return this.up(files, Dirpath);
    },

    up: function (files, Dirpath) {
        if (files != '') {
            var tmp_path = files.path;
            var now = new Date();

            var dataPath = now.format('yyyy/MM/dd');
            var relationPath = '/data/' + Dirpath + '/' + dataPath;//相对路径 WEB URL
            var dirPath = C.static + relationPath;//物理路径
            this.checkDir(relationPath);//创建目录
            //图片名字命名
            var picName = now.format('hhmmssS') + Math.round(Math.random() * 95) + 5;
            var type = this.checkType(files.type);
            if (type == -1) {
                fs.unlink(tmp_path);
                return '';//不允许上传文件
            }
            //物理路径
            var target_path = dirPath + '/' + picName + type;

            // console.log(target_path);
            // 移动文件
            fs.rename(tmp_path, target_path, function (err) {
                if (err) throw err;
                // 删除临时文件夹文件,
                fs.unlink(tmp_path);
            })
            //console.log(relationPath);
            return relationPath + '/' + picName + type;
        }
        else {
            return '';
        }

    },

    //上传路径检查与创建
    checkDir: function (dir) {
        var path = dir.split('/');
        var create = C.static + '/';//初始值为静态物理路径
        for (i = 0; i < path.length; i++) {
            create += path[i] + '/';
            if (!fs.existsSync(create)) {
                fs.mkdirSync(create);
            }
            //console.log(create);
        }

    },
    //上传大小
    checkType: function (type) {
        var extend = '';
        switch (type) {
            case 'image/jpeg':
                extend = '.jpg';
                break;
            case 'image/gif':
                extend = '.gif';
                break;
            case 'image/png':
                extend = '.png';
                break;
            default :
                extend = -1;
                break;
        }

        return extend;
    }

}

//时间格式
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

module.exports = upload;