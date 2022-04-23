var express = require('express');
var router = express.Router();
const dbHandler = require('../handle/dbHandler')
/* GET home page. */
router.get('/user/getInfo', dbHandler.getUsers);

// 登录
router.post('/api/login', dbHandler.LoginAcount);

// 注册
router.post('/api/regist', dbHandler.registUser);

// 获取好友信息
router.get('/user/friend', dbHandler.getFriendList)

// 获取个人题库消息
router.get('/user/private/topic', dbHandler.getPrivateTopic)

// 收藏题目到个人题库
router.post('/user/collect/topic', dbHandler.collectTopic)

// 判断该题是否被收藏
router.post('/user/has/collect', dbHandler.hasCollection)

// 查找好友
router.get('/user/find/friend', dbHandler.findFriends)

// 修改资料
router.post('/user/set/info', dbHandler.setInfo)

// 修改密码
router.post('/user/set/password', dbHandler.setPassword)

module.exports = router
