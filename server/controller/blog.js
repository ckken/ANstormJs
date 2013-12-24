var o = require('./base');

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

    D('blogs')._list(op, function (err, todos) {

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
        D('blogs').findById(id, function (err, row) {
            if (err) {
                res.json({code: 1, data: err, tips: '非法操作 找不到相关资源'});

            }
            if (!row) {
                res.json({code: 1, data: err, tips: '非法操作 找不到相关资源'});
            }
            else {
                row.creattime = _S.date.format(row.creattime, 'yyyy-mm-dd hh:ii:ss');
                row.updatetime = _S.date.format(row.updatetime, 'yyyy-mm-dd hh:ii:ss');
                D('members').findOne({name: row.author}, function (err, data) {
                    if (data != null) {
                        row.author = data;
                        row.avatar = _S.encode.md5(data.email || '');
                    }
                    res.json({"blogs": row});
                });
                D('blogs').update({_id:row._id}, {$inc: {view: 1}}, function (e, r) {
                });
            }

        });
    } else {
        res.json({code: 1, data: err, tips: '找不到相关资源'});
        next();
    }
}



o.userList = function (req, res, next) {
    var deferred = Q.defer();
    var _S = this;
    var getMember = function () {
        var where = {};
        // where.postnum ={$gt:0};
        where.status = true;
        var bysort = {'_id': -1};
        var limit = 28;
        D('members').find().sort(bysort).limit(limit).lean().exec(function (err, data) {
            if (err) deferred.reject(err);
            data.forEach(function (vo) {
                vo.avatar = _S.encode.md5(vo.email);
                delete vo.password;
            });
                deferred.resolve(data);
        })
        return deferred.promise;
    }

    var counMember = function (data) {
        D('members').count({}, function (err, count) {
            var userlist = {};
            userlist.data = data;
            userlist.num = count;
            res.json(userlist);
        })
    }

    getMember().then(counMember);
}



o.insert = function (req, res, next) {
    var _S = this;
    var deferred = Q.defer();
    var get = {};
    get.title = req.body.title || '';
    get.content = req.body.content || '';
    get.tags = req.body.tags || '';
    get.status = req.body.status || 0;
    get.title = get.title.trim();
    get.content = get.content.trim();
    console.log(get);
    if (!get.title) {
        res.json({code: 1, tips: "标题是必须的"});
    }
    else if (!get.content) {
        res.json({code: 1, tips: "内容不能为空"});
    }

    var checkNum = function () {
        D('blogs').count({email: _S.Guser.email, title: get.title}, function (err, count) {

            if (err)deferred.reject(err);
            else deferred.resolve(count);
        });
        return deferred.promise;
    }

    var insertData = function (count) {

        if (count>0)deferred.reject(res.json({code: 1, tips: "存在同标题的内容"}));
        var d = get;
        //d.pic=_S.Up.init(req.files.pic);
        d.ip = _S.Guser.ip;
        d.email = _S.Guser.email;
        d.author = _S.Guser.name;

        D('blogs').insert(d, function (err, row) {
            if (err)deferred.reject(next(err));
            deferred.resolve(row);
            res.json({code: 0, data: row, tips: "添加成功"});
        })
        return deferred.promise;
    }

    var insertTags = function (d) {
        deferred.resolve(d);
        if (d.tags.length > 0) {
            d.tags.forEach(function (v) {
                D('tags').count({tags: v}, function (err, count) {
                    if (count > 0) {
                    }
                    else {
                        var t = {};
                        t.tags = v;
                        t.ip = _S.Guser.ip;
                        t.email = _S.Guser.email;
                        t.author = _S.Guser.name;
                        D('tags').insert(t, function (err, row) {
                        })
                    }
                });
            })
        }
        return deferred.promise;
    }

    var updateNum = function (d) {
        D('members').update({email: d.email}, {$set: {$inc: {postnum: 1}}}, function (r) {
            next();
        });
    }

    o.blogCuser(res).then(checkNum).then(insertData).then(insertTags).then(updateNum);

}

o.update = function (req, res, next) {
    var _S = this;

    var updateData = function(){
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
            D('blogs').update({_id: id, email: this.Guser.email}, d, function (err, result) {
                if (err && result==null)res.json({status: 1, tips: '无权限操作'});
                else res.json({status: 1, tips: '更新成功'});
            });
        }
        else {
            next();
        }
    }

    o.blogCuser(res).then(updateData);

}
o.delete = function (req, res, next) {
    var _S = this;
    var deferred = Q.defer();
    var findID = function () {
        var id = req.getData.id;
        D('blogs').findById(id, function (err, row) {

            if ('undefined' !== typeof row._id) {
                deferred.resolve(row);
            }
            else {
                deferred.reject(res.json({status: 1, tips: '找不到相关资源'}));
            }
        });
        return deferred.promise;
    }
    var deleteByID = function (row) {

        D('blogs').delete({_id: row._id}, function (err) {
            if (err) {
                deferred.reject(next(err));
            }
            if (row.pic != '') {
                fs = require('fs');
                if ('undefined' !== typeof row.pic)fs.unlink(C.static + '/' + row.pic);
            }

            deferred.resolve(row);
            res.json({status: 0, tips: '成功删除'});
        });
        return deferred.promise;
    }
    var updateMembersCount = function (row) {
        D('members').update({email: row.email}, {$inc: {postnum: -1}}, function (r) {
        });
    }
    o.blogCuser(res).then(findID).then(deleteByID).then(updateMembersCount);
}
o.blogCuser = function (res,email) {
    deferred = Q.defer();
    var check = 0;
    if (('undefined' !== typeof this.Guser.email && 'undefined' !== typeof email && this.Guser.email == email) || this.Guser.admin) {
        deferred.resolve(true);
    }
    else {
        deferred.reject(res.json({status: 1, tips: '无权限操作'}));
    }
    return deferred.promise;
}

module.exports = o;