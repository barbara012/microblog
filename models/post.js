var mongodb = require('./db');

function Post(username, post, time){
  this.user = username;
  this.post = post;
  this.time = time?time:new Date();
};

module.exports = Post;

Post.prototype.save = function save(callback){
  //存入MongoDB的文档
  var post = {
    user:this.user,
    post:this.post,
    time:this.time
  };

  mongodb.open(function(err, db){
    if(err)
      callback(err);

    //读取posts集合
    db.collection('posts', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }

      //为user属性添加索引
      collection.ensureIndex("user", function(err, indexName){
        callback(err);
      });
      collection.insert(post, function(err, post){
        mongodb.close();
        callback(err, post)
      });
    });
  });
}

Post.get = function get(username, callback){
  mongodb.open(function(err, db){
    if (err)
      return callback(err);

    //读取posts集合
    db.collection('posts', function(err, collection){
      if (err){
        mongodb.close();
        return callback(err);
      }

      //查找属性user为username的文档，如果usernam为null则匹配全部
      var query = {};
      if(username){
        query.user = username;
      }
      collection.find(query).sort({time:-1}).toArray(function(err, docs){
        mongodb.close();
        if(err)
          callback(err,null);

        //封装posts为Post对象
        var posts = [];
        docs.forEach(function(doc, index){
          var post = new Post(doc.user, doc.post, doc.time);
          posts.push(post);
        });
        callback(null, posts);
      });
    });
  });
}
