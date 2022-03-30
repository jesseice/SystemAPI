var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const expressJWT = require('express-jwt')
const { Server } = require("socket.io");

// 导入路由
var userRouter = require('./routes/user')
var examRouter = require('./routes/exam')
var createQRouter = require('./routes/createQ')
// ---------------------------------------

const cors = require('cors')

const secretKey = 'wuyingdong ^*_*^ 123'
var app = express();
const server = require('http').createServer(app)
const io = new Server(server, { /* options */
  cors: {
    origin: "*"
  }
})

// 管理登录用户集合
const sockets = new Map()

// 连接后处理
io.on("connection", (socket) => {
  // ...
  socket.emit('send', 'hello')
  // 登录后设置账号和socket id键值对，并发送回去
  socket.on('set sockets',(user_name)=>{
    sockets.set(user_name,socket.id)
    console.log(sockets)
  })

  // 点击好友时候查找好友的socketId
  socket.on('find friend socketid', (username) => {
    socket.emit('get friend socketid', socket.id, sockets.get(username))
  })

  // 私聊
  socket.on("private message", (anotherSocketId, msg, authorName) => {
    socket.to(anotherSocketId).emit("private message", socket.id, msg, authorName);
  })

  // 断开连接后回调函数
  socket.on('disconnect', function () {
    console.log('断开连接!:', socket.id);
    for (let k of sockets) {
      if (k[1] === socket.id) {
        sockets.delete(k[0])
      }
    }
  })
})

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressJWT({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: [/\/api\//] }))

// 绑定路由
app.use('/', userRouter);
app.use('/', examRouter)
app.use('/', createQRouter)
// ---------------------------------------

app.use((err,req,res,next)=>{
  if (err.name === 'UnauthorizedError'){
    return res.send({
      code:1004,
      msg:'未登录'
    })
  }
  res.send({
    code:500,
    msg:'未知错误'
  })
})

server.listen(3000)

