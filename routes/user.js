var express = require('express');
var router = express.Router();
const dbHandler = require('../handle/dbHandler')
/* GET home page. */
router.get('/user/getInfo', dbHandler.getUsers);

// 登录
router.post('/api/login', dbHandler.checkAcount);

// 注册
router.post('/api/regist', dbHandler.registUser);

// 获取好友信息
router.get('/user/friend',dbHandler.getFriendList)

module.exports = router
