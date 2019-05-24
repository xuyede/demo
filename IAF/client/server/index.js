var express = require('express')
var proxy = require('http-proxy-middleware')
var globalConfig = require('./config')
var history = require('connect-history-api-fallback');

var app = new express()

app.use(history());  //Vue路由使用history模式时,需要加上这个,不然会报错

app.use('/', express.static(globalConfig.page_path,{maxAge:'1m'}) )

app.use('/api', proxy({
  target: `http://localhost:${globalConfig.target}`,
  pathRewrite: {'/api': ''}
}))

app.listen(globalConfig.port, function () {
  console.log('服务器启动, 监听端口:' + globalConfig.port)
  console.log(`http://127.0.0.1:${globalConfig.port}`)
})
