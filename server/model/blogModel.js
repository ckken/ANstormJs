D.bind('blogs', {
    findTop10 : function (fn) {
        this.find({}, {limit:10, sort:[['views', -1]]}).toArray(fn);
    },
    findById: function(id,fn){
        // mongoskin {_id: db.ObjectID.createFromHexString('4f5bc53f3d0b5eb764000002')}
        console.log(id);
        this.findOne({_id: this.ObjectID(id)},function(err,d){
        //this.findOne({_id: blogs.id},function(err,d){
            fn(err,d);
        });
    },
    _list:function(opt,fn){
        var _S = this;
        var where = ('undefined' !== typeof opt.where) ? opt.where : {};
        var page = ('undefined' !== typeof opt.page) ? opt.page : 1;
        var perPage = ('undefined' !== typeof opt.perPage) ? opt.perPage : 10;
        var bysort = ('undefined' !== typeof opt.sort) ? opt.sort : {
            '_id': -1
        };
        _S.count(where, function (err, count) {
            _S.find(where,{sort:bysort,skip:(page - 1) * perPage,limit:perPage}).toArray(function (err, doc) {

                var d = [];
                d.data = doc;
                d.count = count;
                fn(err, d);
            })
        });
    },
    removeTagWith : function (tag, fn) {
        this.remove({tags:tag},fn);
    },
    delete:function(id,fn){
        this.remove({_id: this.ObjectID(id)},function(err){
            fn(err);
        });
    }
});

