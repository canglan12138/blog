var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')


var router = express.Router()

router.get('/',(req,res) => {
  res.render('index.html',{
    user: req.session.user
  })
})

router.get('/login',(req,res) => {
  res.render('login.html')
})

router.post('/login',(req,res,next) => {
  body = req.body

  User.findOne({
    email:body.email,
    password: md5(md5(body.password))
  },(err,user) => {

    if (err) {
      return next(err)
    }

    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or password is invaild.'
      })
    }

    //用户存在 登陆成功 记录登陆状态
    req.session.user = user

    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

router.get('/register',(req,res) => {
  res.render('register.html')
})

router.post('/register',(req,res,next) => {
  /*
  * 1.获取表单提交的数据
  * 2.操作数据库
  *   判断用户是否存在
  * 3.发送响应
  * */
  var body = req.body
  User.findOne({
    $or: [
      {
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  },(err,data) => {
    if (err) {
      return next(err)
    }
    if (data) {
      //邮箱已存在
      return res.status(200).json({
        err_code: 1,
        message: 'Email already'
      })
    }
    //对密码进行 md5 重复加密
    body.password = md5(md5(body.password))
    new User(body).save((err,user) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          err_code: 500,
          message: 'Internal error'
        })
      }

      //注册成功 通过 session 记录用户状态
      req.session.user = user

      //Express 提供了一个响应方法：json
      //该方法接收一个对象作为参数，它会自动把对象转为字符串再发送给浏览器
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    })
  })
})

module.exports = router