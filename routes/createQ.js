const express = require('express')
var router = express.Router();
const dbHandler = require('../handle/dbHandler')

// 创建题目
router.post('/user/createQ', dbHandler.createQuestion);

// 题目标签
router.get('/api/getTag', dbHandler.getTag);

module.exports = router