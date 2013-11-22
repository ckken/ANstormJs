var o = require('./base');
require(C.model+'/blogModel');

o.index = function (req, res, next) {
    var _S = this;
    var page = (req.query.p > 0) ? req.query.p : 1;
    var perPage = (req.query.pr < 10) ? req.query.pr : 10;
    var pageList = '';
    //搜索
    var where = {};
    var s = ('undefined' !== typeof req.query.s) ? req.query.s : ('undefined' !== typeof req.getData.s) ? req.getData.s : '';
    var s = eval("\/" + s + "\/i");
    if ('undefined' !== typeof s) {
        where.$or = [
            {title: s}
            ,
            {content: s}
            ,
            {tags: s}
        ];
    }
    //where.status = true;
    var op = {};
    op.where = where;
    op.page = page;
    op.perPage = perPage;
    //bysort
    var bysort = ('undefined' !== typeof req.getData.bysort && req.getData.bysort != '') ? req.getData.bysort : '';
    switch (bysort) {
        case 'latest':
            op.sort = {'_id': -1};
            break;
        case 'hot':
            op.sort = {'view': -1};
            break;
        case 'comments':
            op.sort = {'commentnum': -1};
            break;
        default:
            op.sort = {'_id': -1};
            break;
    }



    D.collection('blogs')._list(op, function (err, todos) {

        if (err) return next(err);

        todos.data.forEach(function (vo) {
            vo.creattime = _S.date.dgm(vo.creattime, 'yyyy-mm-dd');
            vo.updatetime = _S.date.dgm(vo.updatetime, 'yyyy-mm-dd');
            if ('undefined' !== typeof vo.email)vo.avatar = _S.encode.md5(vo.email);
            if ('undefined' !== typeof vo.content) {
                vo.content = _S.html.delHtmlTag(vo.content);
                vo.content = vo.content.substring(0, 250);
            }
        })

        pageList = _S.pN.pageNavi(page, todos.count, perPage);

        res.json({
            blogs: todos.data,
            page: pageList
        });

    });
}
o.content = function (req, res, next) {
    var _S = this;
    if ('undefined' !== typeof req.getData) {
        var where = {};
        id = req.getData.id;
        D.collection('blogs').findById(id,function (err, row) {
            if (err) {
                res.json({code: 1, data: err, tips: '非法操作 找不到相关资源'});

            }
            if (!row) {
                res.json({code: 1, data: err, tips: '非法操作 找不到相关资源'});
            }
            else {
                row.creattime = _S.date.format(row.creattime, 'yyyy-mm-dd hh:ii:ss');
                row.updatetime = _S.date.format(row.updatetime, 'yyyy-mm-dd hh:ii:ss');
                D.collection('members').findOne({name:row.author},function (err, data) {
                    console.log(data);
                    if(data!=null){
                        row.author = data;
                        row.avatar = _S.encode.md5(data.email||'');
                    }

                     res.json({"blogs":row});
                });
                D.collection('blogs').updateById(row._id,{$inc: {view: 1}}, function (e,r) {
                });
            }


        });
    } else {
        res.json({code: 1, data: err, tips: '找不到相关资源'});
        next();
    }
}

o.author = function (req, res, next) {

    if (req.getData.name == '') {
        next();
    }
    else {
        var _S = this;
        var page = req.query.p;
        var perPage = (req.query.pr) ? req.query.pr : 10;
        var pageList = '';
        //搜索
        var where = {};
        var s = req.query.s;
        var s = eval("\/" + s + "\/i");
        if ('undefined' != typeof req.query.s) {
            where.$or = [
                {title: s},
                {content: s}
            ];
        }
        where.author = req.getData.name;
        var op = {};
        op.where = where;
        op.page = page;
        op.perPage = perPage;


        D.collection('blogs')._list(op, function (err, todos) {

            if (err) return next(err);

            todos.data.forEach(function (vo) {
                vo.creattime = _S.date.dgm(vo.creattime, 'yyyy-mm-dd hh:ii:ss');
                vo.updatetime = _S.date.dgm(vo.updatetime, 'yyyy-mm-dd hh:ii:ss');
                vo.avatar = _S.encode.md5(vo.email);
                vo.content = _S.html.delHtmlTag(vo.content);
                vo.content = vo.content.substring(0, 250);
            })

            pageList = _S.pN.pageNavi(page, todos.count, perPage);
            where = {name: req.getData.name, status: true};


            D.collection('members').findOne(where, function (err, userinfo) {

                if ('undifined' !== typeof userinfo) {

                    userinfo.avatar = _S.encode.md5(userinfo.email);
                    res.json({
                        blogs: todos.data,
                        page: pageList,
                        author: userinfo
                    });


                }
                else {
                    next();
                }

            })


        });
    }
}


o.userList = function (req, res, next) {
    var where = {};
    var _S = this;
    // where.postnum ={$gt:0};
    where.status = true;
    var bysort = {'_id': -1};
    var limit = 28;

    D.collection('members').find().sort(bysort).limit(limit).toArray(function(err,data){
        if (err) throw err;
        data.forEach(function (vo) {
            vo.avatar = _S.encode.md5(vo.email);
            vo.createtime = _S.date.dgm(vo.createtime, 'yyyy-mm-dd hh:ii:ss');
            vo.logintime = _S.date.dgm(vo.logintime, 'yyyy-mm-dd hh:ii:ss');
        });

        D.collection('members').count({}, function (err, count) {
            var userlist = {};
            userlist.data = data;
            userlist.num = count;
            res.json(userlist);
        })
    })



}

module.exports = o;