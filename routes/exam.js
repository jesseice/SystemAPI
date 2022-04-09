const express = require('express')
var router = express.Router();
const dbHandler = require('../handle/dbHandler')

// 考试试卷
router.post('/user/exam', dbHandler.getSubject);

// 考试题目数量
router.get('/api/getSubNum', dbHandler.getSubNum);

// 提交答案
router.post('/user/cmtresult', dbHandler.commitResult);

// 查询题目
router.post('/api/find/topic', dbHandler.watchTopic)

module.exports = router