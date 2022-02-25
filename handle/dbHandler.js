const dbUtil = require('../util/dbconfig')
const random = require('../util/random')
const computed = require('../util/computed')
// const crypto = require('../util/crypto')

const jwt = require('jsonwebtoken')

const secretKey = 'wuyingdong ^*_*^ 123'
// 获取用户信息
const getUsers = (req, res, next)=> {
  let sql = 'select * from web_system.users'
  let sqlObj = {}
  let callback = (err, result) => {
    if (err) { return console.log('获取信息失败!') }
    console.log('成功');
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
        // msg = '密码错误！请重新输入!'
      }else{
        msg = '登录成功!'
        code = '200'
        token = jwt.sign({ user_id: result[0].user_id, user_name: req.body.userName }, secretKey, { expiresIn: '240h' })
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
// const checkAcount = async (req,res,next)=>{
//   const sql = 'select * from web_system.users where user_name = ?'
//   console.log(req.query)
//   const sqlObj = {user_name:req.query.userName}
//   let res = await dbUtil.SysqlConnect(sql,sqlObj);
//   console.log(res);
//   if(res.length){
//     console.log(res);
//   }else{
//      console.log(res);
//   }
// }

// 注册用户
const registUser = (req, res, next) => {
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
    if (err) { return res.send(err.sqlMessage) }
    if (res.affectedRows === 1) { console.log('注册成功'); }
    res.send({
      status: 200,
      msg: '注册成功',
      data: req.body
    })
  }
  dbUtil.sqlConnect(sql,sqlObj,callback)
}

// 获取随机考试试题
const getSubject =async (req, res, next) => {
  //random的参数需要冲req.body中取   或者不用
  let subject = []
  let arr = [random(6, 4), random(1, 1), random(1, 1)]
  for(let i=0;i<3;i++){
    let sql = `select subject_id,subject_title,subject_select,subject_type from web_system.subject${i} where subject_id in (?)`
    let sqlObj = {subject_id:arr[i]}
    const res = await dbUtil.SysqlConnect(sql, sqlObj)
    subject.push(...res)
  }
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

  for(let i=0;i<3;i++){
    let sql = `select subject_id,subject_result from web_system.subject${i} where subject_id in (?)`
    let sqlObj = {subject_id: arr[i] }
    const res  = await dbUtil.SysqlConnect(sql,sqlObj)
    tall.push(res)
  }
  const r = computed(tall,body)
  // console.log('---------------------');
  // console.log(arr);
  // console.log(tall);
  res.send(r)
}

const createQuestion = (req,res,next)=>{
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
  const callback = (err, result) => {
    if (err) { return res.send(err.sqlMessage) }
    if (res.affectedRows === 1) { console.log('创建题目成功'); }
    res.send({
      code: 200,
      data: result,
      msg: '创建题目成功'
    })
  }

  dbUtil.sqlConnect(sql,sqlObj,callback)
}

// 创建题目




module.exports = {
  getUsers,
  registUser,
  checkAcount,
  getSubject,
  commitResult,
  createQuestion
}