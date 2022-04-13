const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressJWT = require('express-jwt')
const { Server } = require("socket.io");
// 离线消息类
const Msg = require('./util/msg')
// 好友请求类
const Chum = require('./util/chum')
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
const sockets = new Map() // {who1Login:socketId, who2Login:socketId}

// 管理离线消息
const leaveNews = new Map() // {who1Msg:new Msg(whoMsg),who2Msg:new Msg(whoMsg)}

//  登录用户是否进入聊天界面
const usersInChat = new Map() // {whoLogin:true|false}   true:在聊天室 false:不在聊天室但是登录着

// 管理好友请求的对象
const chumRequests = new Map() // {whomsg1:{author1:new Chum(),whomsg2:new Chum}}

// 连接后处理
io.on("connection", (socket) => {
  // ...
  // console.log(socket.id)
  // 登录后设置账号和socket id键值对，并发送回去
  socket.on('set sockets',(user_name)=>{
    sockets.set(user_name,socket.id)
    usersInChat.set(user_name,false)
    // console.log(1);
    // console.log(sockets)
  })  

  // 进入聊天页面设置usersInChat的状态
  socket.on('is in chat page',(user_name, bool)=>{
    usersInChat.set(user_name,bool)
    console.log(2);
  })

  // 是否有消息
  socket.on('is has msg', (authorName) => {
    // console.log('进来了了:',authorName);
    socket.emit('is has msg', leaveNews.has(authorName))
  })

  // 点击好友时候查找好友的socketId
  socket.on('find friend socketid', (username) => {
    socket.emit('find friend socketid', socket.id, sockets.get(username))
  })

  // 私聊
  socket.on("private message", (anotherSocketId, anotherName, msg, authorName) => {

    // 离线状态 anotherSocketId为null || 没有进入聊天页面前端确实私聊监听也可以用离线状态的逻辑来处理消息
    if (!anotherSocketId || !usersInChat.get(anotherName)){
      if (!leaveNews.get(anotherName)){
        
        leaveNews.set(anotherName, new Msg(anotherName))
      }
      leaveNews.get(anotherName).inputMsg(authorName, msg)
      if (!usersInChat.get(anotherName)){
        socket.to(anotherSocketId).emit('is has msg', true)
      }
    }else{
      socket.to(anotherSocketId).emit("private message", socket.id, msg, authorName);
    }
  })

  // 进入聊天页面后检查是否有自己的离线消息
  socket.on('check leave msg',(authorName)=>{
    if(leaveNews.has(authorName)){
      let c = leaveNews.get(authorName)
      
      for (let i = 0; i < c.getWhoSends().length; i++) {
        let whoSend = c.getWhoSends()[i]
        let length = c.getSize(whoSend)
        for (let index = 0; index < length; index++) {
          let msg = c.outputMsg(whoSend)
          console.log(`${whoSend}发的消息:`, msg)
          socket.emit('check leave msg', whoSend, msg)
        }
      }
      leaveNews.delete(authorName)
      console.log('发送离线消息后的le:',leaveNews)
    }
  })

  socket.on('add friend',(author_name, author_id, another_name)=>{
    if (!chumRequests.has(another_name)){
      chumRequests.set(another_name,{})
    }
    chumRequests.get(another_name)[author_name] = new Chum(author_name, author_id)
    // 对方在线
    if(sockets.has(another_name)){
      socket.to(sockets.get(another_name)).emit('add friend',{
        author_name,
        author_id
      })
    }
  })

  // 反馈好友请求  接受||拒绝
  socket.on('chum request status', (my_name, my_id, his_name, status)=>{
    if(status === 0){
      delete chumRequests.get(my_name)[his_name]
    }else{
      chumRequests.get(my_name)[his_name].addBuddy(my_id, my_name)
    }
  })
  // 退出登录
  socket.on('out login',authorName=>{
    sockets.delete(authorName)
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

