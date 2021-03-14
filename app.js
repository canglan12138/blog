var express = require('express')
//路径操作模块
var path = require('path')
var router = require('./router')
var bodyParser = require('body-parser')

var app = express()

app.use('/public',express.static(path.join(__dirname,'./public')))
app.use('/node_modules',express.static(path.join(__dirname,'./node_modules')))

app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views')) //默认是 views 目录

//配置表单 POST 请求体插件（注意：一定要在 app.use(router) 之前）
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//路由挂载到 app 中
app.use(router)

app.listen(3000,() => {
  console.log('running...');
})
