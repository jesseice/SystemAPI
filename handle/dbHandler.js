const dbUtil = require('../util/dbconfig')
const random = require('../util/random')
const computed = require('../util/computed')
// const crypto = require('../util/crypto')

const jwt = require('jsonwebtoken')
const { send } = require('express/lib/response')

const secretKey = 'wuyingdong ^*_*^ 123'

// 保存试题数据
const subObject = {
  radio:{
    count:0,
    listId:[]
  },
  judge:{
    count:0,
    listId:[]
  },
  multi:{
    count:0,
    listId:[]
  },
  
}
// 获取用户信息
const getUsers = (req, res, next)=> {
  let user = req.user
  let sql = 'select user_id, user_name,user_phone,user_avatar,user_sex,user_createtime,user_avatar from web_system.users where user_id = ?'
  let sqlObj = user.user_id
  let callback = (err, result) => {
    if (err) { return console.log('获取信息失败!') }
    res.send({
      code:200,
      msg:'获取成功',
      data:result
    })
  }

  dbUtil.sqlConnect(sql, sqlObj, callback)
}

// 登录账号密码的检测：
const checkAcount = (req, res, next) => {
  const sql = 'select * from web_system.users where user_name = ?'
  const sqlObj = [req.body.userName]
  const callback = (err, result) => {
    if(err){return res.send('400')}
    let msg = ''
    let code = ''
    let token = ''
    if(result.length){
      if (result[0].user_password!==req.body.userPassword){
        console.log(result);
        msg = '密码错误'
        code = '400'
      }else{
        msg = '登录成功!'
        code = '200'
        // 生成token
        token = jwt.sign({ user_id: result[0].user_id, user_name: req.body.userName }, secretKey, { expiresIn: '24h' })
      }
    }else{
      code = '400'
      msg = '不存在该用户!'
    }
    res.send({
      code,
      msg,
      token
    })
  }
  dbUtil.sqlConnect(sql, sqlObj, callback)
}

// 注册用户
const registUser = (req, res, next) => {
  console.log(req.body);
  const body = req.body
  const sql = 'insert into web_system.users SET ?'
  const sqlObj = {
    user_name: body.userName,
    user_password: body.userPassword,
    user_sex: body.userSex || '男',
    user_phone: body.userPhone,
    user_createtime: new Date()
  }
  const callback = (err, result) => {
    if (err) { return res.send({
      code:400,
      msg:err.sqlMessage}) }
    if (result.affectedRows === 1) { console.log('注册成功'); }
    res.send({
      status: 200,
      msg: '注册成功',
      data: req.body
    })
  }
  dbUtil.sqlConnect(sql,sqlObj,callback)
}

// 获取试题数量
const getSubNum = async (req,res,next)=>{
  // let radio = 0, judge = 0, multi = 0
  let temp = []
  for(let i=0; i<3; i++){
    temp[i] = []
    try{
      const sql = `select subject_id from web_system.subject${i}`
      const res = await dbUtil.SysqlConnect(sql, {})
      for(let k in res){
        temp[i].push(res[k].subject_id)
      }
    }catch(err){
      res.send({
        code:500,
        msg:'未知错误'
      })
    }
  }
  
  let cur = 0
  for(let k in subObject){
    subObject[k].listId.push(...temp[cur])
    subObject[k].count = temp[cur].length > 100 ? 100 : temp[cur].length
    cur++
  }

  // console.log(subObject)
  res.send({
    code:'200',
    msg:'获取成功',
    data: [subObject.radio.count, subObject.judge.count, subObject.multi.count]
  })
}


// 获取随机考试试题
const getSubject =async (req, res, next) => {
  //random的参数需要冲req.body中取   或者不用
  // console.log('---');
  // console.log(req.body);
  // console.log('---');
  const _body = req.body
  let subject = []
  let arr = [random(subObject.radio, _body[0]), random(subObject.judge, _body[1]), random(subObject.multi, _body[2])]
  console.log(arr)
  for(let i=0;i<3;i++){
    if(arr[i].length===0){continue}
    let sql = `select subject_id,subject_title,subject_select,subject_type from web_system.subject${i} where subject_id in (?)`
    let sqlObj = arr[i].length===1?arr[i]: { subject_id:arr[i] }
    try{
      let res
      await dbUtil.SysqlConnect(sql, sqlObj).then((e)=>res = e)
      subject.push(...res)
    }catch(err){
      res.send({
        code:500,
        msg:'未知错误'
      })
    }
  }
  // console.log('----')
  // console.log(arr)
  // console.log(subject)
  // console.log('----')
  res.send({
    code: 200,
    msg: '获取成功',
    data: subject
  })
}

// 前端提交答案的api
const commitResult = async (req,res,next)=>{
  const body = req.body
  // let arr[0] = [] // 单选
  // let arr[1] = [] // 判断
  // let arr[2] = [] // 多选
  let arr = [[], [], []]
  for(let k in body){
    for(let sk in body[k]){
      arr[k].push(sk)
    }
  }

  let tall = []
  // console.log('++++++');
  // console.log(arr);
  // console.log('++++++');
  for(let i=0;i<3;i++){
    if (arr[i].length === 0) { continue }
    let sql = `select subject_id,subject_result from web_system.subject${i} where subject_id in (?)`
    let sqlObj = arr[i].length === 1 ? arr[i] : { subject_id: arr[i] }
    const res = await dbUtil.SysqlConnect(sql,sqlObj)
    tall.push(res)
  }
  const r = computed(tall,body)
  res.send(r)
}

// 创建题目
const createQuestion = async (req,res,next)=>{
/**
 * {
 *    
 * }
 */
  const _body = req.body
  const sql = `insert into web_system.subject${_body.subject_type} set ?`
  const sqlObj = {
    subject_title:_body.subject_title,
    subject_select: _body.subject_select,
    subject_result: _body.subject_result,
  }
  const aa = await dbUtil.SysqlConnect(sql,sqlObj)
  console.log(aa)
  let insertId = aa.insertId
  if (aa&&aa.affectedRows === 1){
    for (let i = 0; i < _body.tags.length; i++) {
      try {
        // 修改subject_tag表
        await dbUtil.SysqlConnect(
          `insert into web_system.subject_tag set ?`,  
          { subject_id: insertId, subject_type: _body.subject_type, tag_id: _body.tags[i] }
        )
      } catch (err) {
        res.send({ code: 500, msg: err })
      }
    }
  }else{
    return res.send({
      code:400,
      msg:'前端错误'
    })
  }
  res.send({
    code: 200,
    data: aa,
    msg: '创建题目成功'
  })
}

// 获取标签
const getTag = (req,res,next)=>{
  const sql ='select * from web_system.tag order by tag_id asc'
  const callBack = (err,result)=>{
    if(err){
      return res.send({
        code:500,
        msg: err.sqlMessage
      })
    }
    res.send({
      code:200,
      msg:'获取tag成功!',
      data:result
    })
  }
  dbUtil.sqlConnect(sql,callBack)
}

// 获取好友信息
const getFriendList = (req,res,next)=>{
  const user = req.user
  const sql = 'select friend_id,friend_name,user_name, user_avatar as friend_avatar,last_news as news,last_time as time from(web_system.friend_list as a) left join(web_system.users as b) on a.friend_id = b.user_id where a.user_id = ?'
  const sqlObj = user.user_id
  const callBack = (err , result)=>{
    if(err){
      return res.send({
        code:500,
        msg:'获取好友列表失败！'
      })
    }
    res.send({
      code:200,
      msg:'获取成功',
      data: result
    })
  }
  dbUtil.sqlConnect(sql,sqlObj,callBack)
}

// 获取个人题库信息
const getPrivateTopic = async (req, res, next)=>{
  // result =
  // [{
  //  pri_id: 1,
  //  sbj_id: 1,
  //  sbj_title: '下列哪个样式定义后,内联(非块状)元素可以定义宽度和高度',
  //  sbj_type: 0
  // },
  //  {
  //   pri_id: 2,
  //   sbj_id: 3,
  //   sbj_title: '新窗口打开网页，用到以下哪个值（）。',
  //   sbj_type: 0
  // }]
  const user = req.user
  const user_id = user.user_id
  const sql = 'select id as pri_id, sbj_id, sbj_title, sbj_type from web_system.private_topic where user_id = ?'
  const sqlObj = user_id
  const result = await dbUtil.SysqlConnect(sql,sqlObj)
  let newResult = [...result]
  let length = result.length
  for(let i = 0; i<length; i++){
    let subject_id = result[i].sbj_id
    let subject_type = result[i].sbj_type
    const tags = await dbUtil.SysqlConnect(
      'SELECT tag_name FROM web_system.subject_tag as a left join web_system.tag as b on a.tag_id = b.tag_id where subject_id = ? and subject_type = ?',
      [subject_id, subject_type]
    )
    let newarr = []
    tags.forEach(val => {
      newarr.push(val.tag_name)
    })
    newResult[i].sbj_tag = [...newarr]
  }
  res.send(newResult)
}

// 题目类    取消收藏||收藏入个人题库
const collectTopic = (req, res, next) =>{
  const user_id = req.user.user_id
  const sbj_id = req.body.sbj_id
  const sbj_type = req.body.sbj_type
  const sbj_title = req.body.sbj_title
  const status = req.body.status
  const pri_ids = req.body.pri_ids || []
  if(status === 0){
    dbUtil.sqlConnect(
      `insert into web_system.private_topic set ?`,
      {user_id, sbj_id, sbj_type, sbj_title},
      (err, result) =>{
        if (err) {
          console.log(err)
          return res.send({
            code:500,
            msg:'收藏失败',
            status:0
          })
        }
        if (result.affectedRows === 1){
          res.send({
            code:200,
            msg:'收藏成功',
            status:1
          })
        }
      }
    )
  } else if (status === 1){
    dbUtil.sqlConnect(
      'delete from web_system.private_topic where user_id = ? and sbj_id = ? and sbj_type = ?',
      [ user_id, sbj_id, sbj_type],
      (err, result) =>{
        if(err){
          console.log(err)
          return res.send({
            code: 500,
            msg: '取消收藏失败',
            status: 1
          })
        }
        if(result.affectedRows === 1){
          return res.send({
            code: 200,
            msg: '取消收藏成功',
            status: 0
          })
        }
      }
    )
  }else{ // 删除题库的某个
      dbUtil.sqlConnect(
        'delete from web_system.private_topic where( id in (?))',
        [pri_ids],
        (err, result) =>{
          if(err){
            return res.send({
              code:500,
              msg:'操作个人题库失败'
            })
          }
          if(result.affectedRows === pri_ids.length){
            res.send({
              code:200,
              msg:'操作成功!',
              data:result
            })
          }
        }
      )
  }
}

// 判断是否该题被收藏
const hasCollection = (req, res, next) =>{
  const user_id = req.user.user_id
  const sbj_id = req.body.sbj_id
  const sbj_type = req.body.sbj_type
  dbUtil.sqlConnect(
    'select id from web_system.private_topic where user_id = ? and sbj_id = ? and sbj_type = ?',
    [user_id, sbj_id, sbj_type],
    (err, result) => {3
      if(err){ return res.send('错误')}
      res.send({
        code:200,
        msg:'成功',
        status:result.length? 1:0 // 0没有收藏  1  收藏
      })
    }
  )
}

module.exports = {
  getUsers,
  registUser,
  checkAcount,
  getSubject,
  commitResult,
  createQuestion,
  getTag,
  getSubNum,
  getFriendList,
  getPrivateTopic,
  collectTopic,
  hasCollection
}