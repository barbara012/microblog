
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user.js');

module.exports = function(app){
  app.get('/', function(req, res){
    res.render('index', { title: '首页'});
  });

  app.get('/reg', chkNotLogin);
  app.get('/reg', function(req, res){
    res.render('reg', { title: '注册'});
  });

  app.post('/reg', chkNotLogin);
  app.post('/reg', function(req, res){
    //检验两次输入的结果是否一致
    if(req.body["password-repeat"] != req.body["password"]){
      req.flash("error", "两次输入的密码不一致");
      return res.redirect('/reg');
    }
    //生成口令的散列值
    var md5 = crypto.createHash("md5")
    var password = md5.update(req.body.password).digest("base64");

    var newUser = new User({
      name:req.body.username,
      password:password
    });

    User.get(newUser.name, function(err, user){
      if(user)
        err = "Username already exists.";
      if(err){
        req.flash('err', err);
        return res.redirect('/reg');
      }

      //如果用户不存在，则添加用户
      newUser.save(function(err){
        if(err){
          req.flash("error", err);
          return res.redirect("/reg");
        }
        req.session.user = newUser;
        req.flash("success", "注册成功");
        res.redirect('/')
      });
    });
  });

  app.get('/login', chkNotLogin);
  app.get('/login', function(req, res){
    res.render('login', {title:'用户登入'});
  });

  app.post('/login', chkNotLogin);
  app.post('/login', function(req, res){
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username, function(err, user){
      if(!user){
        req.flash('error', '用户不存在');
        return res.redirect('/login');
      }
      if(user.password != password){
        req.flash('error', '用户密码错误');
        res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', '登入成功');
      res.redirect('/');
    });    
  });

  app.get('/logout', chkLogin);
  app.get('/logout', function(req, res){
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');    
  });
}

function chkLogin(req, res, next){
  if(!req.session.user){
    req.flash('error', '未登入');
    return res.redirect('/login');
  }
  next();
}

function chkNotLogin(req, res, next){
  if(req.session.user){
    req.flash('error', '已登入');
    return res.redirect('/');
  }
  next();
}
