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

    var deferred = Q.defer();
    var _S = this;
    var getMember = function(){
        var where = {};
        // where.postnum ={$gt:0};
        where.status = true;
        var bysort = {'_id': -1};
        var limit = 28;
        D.collection('members').find().sort(bysort).limit(limit).toArray(function(err,data){
            if (err) deferred.reject(err);
            data.forEach(function (vo) {
                vo.avatar = _S.encode.md5(vo.email);
                vo.createtime = _S.date.dgm(vo.createtime, 'yyyy-mm-dd hh:ii:ss');
                vo.logintime = _S.date.dgm(vo.logintime, 'yyyy-mm-dd hh:ii:ss');
            });
            deferred.resolve(data);
        })
        return deferred.promise;
    }

    var counMember = function(data){
        D.collection('members').count({}, function (err, count) {
            var userlist = {};
            userlist.data = data;
            userlist.num = count;
            res.json(userlist);
        })
    }

    getMember().then(counMember);
}

o.my = function (req, res, next) {
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
    where.email = user.email;
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
        res.render('blog/index.html', {todos: todos.data, page: pageList});
    });
}
o.insert = function (req, res, next) {
    var _S = this;
    if (o.blogCuser()) {
        res.json({status: 1, tips: '无权限操作'});

    } else {

        var title = req.body.title || '';
        var content = req.body.content || '';
        var tags = req.body.tags || '';
        var status = req.body.status || 0;
        title = title.trim();
        content = content.trim();
        if (!title) {
            res.json({code: 1, tips: "标题是必须的"});
        }
        else if (!content) {
            res.json({code: 1, tips: "内容不能为空"});
        }
        //重复添加
        D.collection('blogs').count({email: _S.Guser.email, title: title}, function (err, count) {

            if (count > 0) {
                res.json({code: 1, tips: "存在同标题的内容"});
            }
            else {
                var d = {};
                //d.pic=_S.Up.init(req.files.pic);
                d.title = title;
                d.ip = _S.Guser.ip;
                d.email = _S.Guser.email;
                d.author = _S.Guser.name;
                d.content = content;
                d.status = (status == 1) ? true : false;
                d.tags = (tags) ? tags : '';
                var date = new Date();
                var time = Math.round(date.getTime() / 1000);
                d.updatetime = time;
                d.createtime = time;

                D.collection('blogs').insert(d, function (err, row) {
                    if (err)return next(err);
                    if(d.tags.length>0){
                        d.tags.forEach(function(v){
                            D.collection('tags').count({tags: v}, function (err, count) {
                                if (count > 0) {
                                    next();
                                }
                                else {
                                    var t = {};
                                    t.tags = v;
                                    t.ip = _S.Guser.ip;
                                    t.email = _S.Guser.email;
                                    t.author = _S.Guser.name;
                                    D.collection('tags').insert(t, function (err, row) {
                                        if (err)return next(err);
                                        next();
                                    })
                                }
                            });
                        })
                    }


                    res.json({code: 0, data: row[0], tips: "添加成功"});
                    D.collection('members').update({email: d.email}, {$set: {$inc: {postnum: 1}}}, function (r) {
                    });
                })
                //res.redirect('/');
            }

        });
    }
}

o.update = function (req, res, next) {
    var _S = this;

    if (o.blogCuser()) {
        res.json({status: 1, tips: '无权限操作'});
    }

    if ('undefined' !== typeof req.getData && req.getData.id != '') {

        var title = req.body.title || '';
        title = title.trim();
        if (!title) {
            return res.render('error.html', {message: '标题是必须的'});
        }
        var d = {};
        var id = req.body._id;
        if ('undefined' !== typeof req.files)d.pic = _S.Up.init(req.files.pic);
        d.title = title;
        d.ip = user.ip;
        d.content = req.body.content;
        d.status = (req.body.status == 1) ? true : false;
        d.updatetime = C.time();
        D.collection('blogs').update({_id: id, email: this.Guser.email}, d, function (err, result) {
            //if (err) return res.render('error.html', {message: '找不到相关资源'});
            if (err)res.json({status: 1, tips: '无权限操作'});
            //res.redirect('/blog/userblog/edit/id/' + id);
        });
    }
    else {
        next();
    }
}
o.delete = function (req, res, next) {
    var _S = this;
    var deferred = Q.defer();
    var findID = function(){
    var id = req.getData.id;

        D.collection('blogs').findById(id, function (err, row) {
            console.log(row);
            if (err) {
                //res.json({status: 1, tips: '找不到相关资源'});
                deferred.reject(res.json({status: 1, tips: '找不到相关资源'}));
            }
            if (o.blogCuser(row.email)) {
                deferred.reject(res.json({status: 1, tips: '无权限操作'}));
            } else if('undefined'!==typeof row._id) {
                deferred.resolve(row);
            }
            else{
                deferred.reject(res.json({status: 1, tips: '非法操作'}));
            }
        });
        return deferred.promise;
    }

    var deleteByID = function(row){
        D.collection('blogs').delete(id, function (err) {
            if (err) {
                deferred.reject(next(err));
            }
            if (row.pic != '') {
                fs = require('fs');
                if ('undefined' !== typeof row.pic)fs.unlink(C.static + '/' + row.pic);
            }
            deferred.resolve(row);
        });
        return deferred.promise;
    }

    var updateMembersCount = function(row){
        D.collection('members').update({email: row.email}, {$inc: {postnum: -1}}, function (r) {
            res.json({status: 0, tips: '成功删除'});
        });
    }

    findID().then(deleteByID).then(updateMembersCount);
}
o.blogCuser = function (email) {
    var check = 0;
    if (('undefined' !== typeof this.Guser.email && 'undefined' !== typeof email && this.Guser.email == email)||this.Guser.admin) {
        check = 0;
    }
    else {
        check = 1;
    }
    return check;
}

module.exports = o;