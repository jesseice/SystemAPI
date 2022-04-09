const dbUtil = require('../util/dbconfig')

// 好友请求类
class Chum {
  constructor(author_name, author_id){
    this.author_name = author_name // 谁发送过来的请求
    this.author_id = author_id
  }

  getAuthorName(){
    return this.author_name
  }

  getAuthorId(){
    return this.author_id
  }

  // 接受好友请求
  addBuddy(user_id,user_name){
    dbUtil.sqlConnect(
      'insert into web_system.friend_list SET',
      {
        user_id,
        friend_id: this.getAuthorId(),
        friend_name: this.getAuthorName()
      },
      (err,result) =>{
        if(err){return console.log('添加失败')}
        console.log('添加好友成功')
      }
    )
    dbUtil.sqlConnect(
      'insert into web_system.friend_list SET',
      {
        user_id: this.getAuthorId,
        friend_id: user_id,
        friend_name:user_name
      },
      (err,result) =>{
        if(err){return console.log('添加失败')}
        console.log('添加好友成功')
      }
    )
  }

}

module.exports = Chum