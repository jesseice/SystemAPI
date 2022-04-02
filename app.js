const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressJWT = require('express-jwt')
const { Server } = require("socket.io");
// 离线消息类
const Msg = require('./util/msg')
// new Msg(whoMsg,whoSend)

// 导入路由
const userRouter = require('./routes/user')
const examRouter = require('./routes/exam')
const createQRouter = require('./routes/createQ')
// ---------------------------------------

const cors = require('cors')

const secretKey = 'wuyingdong ^*_*^ 123'
const app = express();
const server = require('http').createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

// 管理登录用户集合
const sockets = new Map()

// 管理离线消息
const leaveNews = new Map()
// { 谁的消息（name）：new Msg(), 谁的消息（name）：new Msg(), 谁的消息（name）：new Msg() }

// 连接后处理
io.on("connection", (socket) => {
  // ...
  // 登录后设置账号和socket id键值对，并发送回去
  socket.on('set sockets',(user_name)=>{
    sockets.set(user_name,socket.id)
    console.log(sockets)
  })

  // 点击好友时候查找好友的socketId
  socket.on('find friend socketid', (username) => {
    socket.emit('find friend socketid', socket.id, sockets.get(username))
  })

  // 私聊
  socket.on("private message", (anotherSocketId, anotherName, msg, authorName) => {

    // 离线状态 anotherSocketId为null
    if (!anotherSocketId){
      if (!leaveNews.get(anotherName)){
        leaveNews.set(anotherName, new Msg(anotherName, authorName))
      }
      leaveNews.get(anotherName).pushMsgArr(msg)
    }else{
      socket.to(anotherSocketId).emit("private message", socket.id, msg, authorName);
    }
  })

  // 进入消息页面后检查是否有自己的离线消息
  socket.on('check leave msg',(authorName)=>{
    if(leaveNews.has(authorName)){
      let curObj = leaveNews.get(authorName)
      let len = curObj.getSize()
      
      for (let i = 0; i<len; i++){
        socket.emit('check leave msg', curObj.getWhoSend(), curObj.shiftMsgArr())
      }
      leaveNews.delete(authorName)
      console.log('发送离线消息后的le:',leaveNews)
    }
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

