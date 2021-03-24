var express = require('express')
//路径操作模块
var path = require('path')

var router = require('./router')
var bodyParser = require('body-parser')
var session = require('express-session')

var app = express()

app.use('/public',express.static(path.join(__dirname,'./public')))
app.use('/node_modules',express.static(path.join(__dirname,'./node_modules')))

app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views')) //默认是 views 目录

//配置表单 POST 请求体插件（注意：一定要在 app.use(router) 之前）
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

/*
* 通过 session 来保存登陆状态
* 通过第三方中间件 express-session
* */
//配置
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
//使用
/*
* 通过 req.session 来访问和设置 session 成员
* 添加 session 数据：req.session.foo = 'bar'
* 访问 session 数据：req.session.foo
* */

//路由挂载到 app 中
app.use(router)

//配置一个处理 404 的中间件
app.use((req,res) => {
  res.render('404.html')
})

//配置全局错误处理中间件
app.use((err,req,res,next) => {
  res.status(500).json({
    err_code: 500,
    message: err.message
  })
})

app.listen(3000,() => {
  console.log('running...');
})
