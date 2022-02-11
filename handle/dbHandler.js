var dbUtil = require('../util/dbconfig')

// 获取用户信息
const getUsers = (req, res, next)=> {
  let sql = 'select * from web_system.users'
  let sqlObj = {}
  let callback = (err, result) => {
    if (err) { return console.log('获取信息失败!') }
    console.log('成功');
    res.send(result)
  }

  dbUtil.sqlConnect(sql, sqlObj, callback)
}

// 注册用户
const registUser = (req, res, next) => {
  const body = req.body
  dbUtil.sqlConnect('insert into web_system.users SET ?',
  {
    user_name: body.userName,
    user_password: body.userPassword,
    user_sex: body.userSex || '男',
    user_phone: body.userPhone,
    user_createtime: new Date()
  },
  (err, result) => {
    if (err) { return res.send(err) }
    if (res.affectedRows === 1) { console.log('注册成功'); }
    res.send({
      status: 0,
      msg: '注册成功',
      data: req.body
    })
  })
}













module.exports = {
  getUsers,
  registUser
}