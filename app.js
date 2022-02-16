var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const expressJWT = require('express-jwt')

// 导入路由
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login')
var registRouter = require('./routes/regist');
var examRouter = require('./routes/exam')
var commitResult = require('./routes/commitResult')
// ---------------------------------------

const cors = require('cors')

const secretKey = 'wuyingdong ^*_*^ 123'
var app = express();
var http = require('http');
var server = http.createServer(app);

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressJWT({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: [/\/api\//] }))

// 绑定路由
app.use('/', indexRouter);
app.use('/api/login', loginRouter)
app.use('/api/regist', registRouter);
app.use('/user/exam', examRouter)
app.use('/user/cmtresult',commitResult)
// ---------------------------------------

app.use((err,req,res,next)=>{
  if (err.name === 'UnauthorizedError'){
    return res.send({
      code:401,
      msg:'无效的token'
    })
  }
  res.send({
    code:500,
    msg:'未知错误'
  })
})

server.listen(3000)

