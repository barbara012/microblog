var mongodb = require('./db');

function User(user){
  this.name = user.name;
  this.password = user.password;
}

module.exports = User;

User.prototype.save = function save(callback){
  //存入Mongodb的文档
  var user = {
    name:this.name,
    password:this.password
  };
  mongodb.open(function(err, db){
    if(err)
      return callback(err);

    //读取user集合
    db.collection('users', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err);
      }

      //为name属性添加索引
      //写入user文档
      collection.insert(user, {w:1}, function(err, user) {
        collection.ensureIndex({'name':1}, {unique:true, w:1, dropDups:true},function(err, indexName){
        });
        mongodb.close();
        callback(err);
      });
    });
  });
}

User.get = function get(username, callback) {
  mongodb.open(function(err, db){
    if(err)
      return callback(err);

    //读取user集合
    db.collection('users', function(err, collection) {
      if(err){
        mongodb.close();
        return callback(err);
      }

      //查找name属性为username的文档
      collection.findOne({name: username}, function(err, doc){
        mongodb.close();
        if(doc){
          //封装文档为User对象
          var user = new User(doc);
          callback(err, user);
        }else{
          callback(err);
        }
      });
    });
  });
};
