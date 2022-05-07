const mysql = require('mysql')

module.exports = {
  // 数据库配置
  config:{
    host:'localhost',
    port:'3306',
    user:'root',
    password:'admin123',
    database:'web_system',
    connectionLimit:100
  },
  // 连接数据库，使用mysql的连接池方式
  // 连接池对象
  sqlConnect:function(sql,sqlArr,callBack){
    let pool = mysql.createPool(this.config)
    pool.getConnection((err,conn)=>{
      if(err) return console.log('连接失败');

      // 事件驱动回调
      conn.query(sql, sqlArr, function (error, results, fields) {
        // When done with the connection, release it.
        conn.release()
        callBack(error, results)

        // Handle error after the release.
        // if (error) throw error

        // Don't use the connection here, it has been returned to the pool.
      })
      // 释放连接
      // conn.release()
    })
  },
  // promise 回调
  SysqlConnect:function(sySql,sqlObj){
    return new Promise((resolve,reject)=>{
      let pool = mysql.createPool(this.config)
      pool.getConnection((err,conn)=>{
        if(err){
          reject(err)
        }else{
          conn.query(sySql,sqlObj,(err,data)=>{
            conn.release()
            if(err){
              reject(err)
            }else{
              resolve(data)
            }
          })
          // conn.release()
        }
      })
    }).catch((err)=>{
      console.log(err)
    })
  }
}
