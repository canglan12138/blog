var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')


var router = express.Router()

router.get('/',(req,res) => {
  res.render('index.html')
})

router.get('/login',(req,res) => {
  res.render('login.html')
})

router.post('/login',(req,res) => {

})

router.get('/register',(req,res) => {
  res.render('register.html')
})

router.post('/register',(req,res) => {
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
      return res.status(500).json({
        success: false,
        message: '服务端错误'
      })
    }
    if (data) {
      //邮箱或者昵称已存在
      return res.status(200).json({
        err_code: 1,
        message: 'Email or nickname already'
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
      //Express 提供了一个响应方法：json
      //该方法接收一个对象作为参数，它会自动把对象转为字符串再发送给浏览器
      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    })
  })
})

module.exports = router