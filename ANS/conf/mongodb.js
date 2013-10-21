var mongodb = module.exports = {
    init : function(app){
        var mongo = C.mod.mongoskin;
        mongo.db(C.config.mongodb);
    },
};
