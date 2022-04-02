/**
 * @param whoMsg 谁的消息
 * @param whoSend 谁发送的
 */
// 离线消息处理类
class Msg {
  constructor(whoMsg,whoSend){
    this.whoMsg = whoMsg
    this.whoSend = whoSend
    this.msgArr = []
  }
  // 获取  谁的消息
  getWhoMsg(){
    return this.whoMsg
  }
  // 获取 谁发的
  getWhoSend(){
    return this.whoSend
  }

  // 获取消息
  getMsg() {
    return this.msgArr
  }

  // 消息长度
  getSize(){
    return this.msgArr && this.msgArr.length
  }
  // 入栈
  pushMsgArr(msg){
    this.msgArr.push(msg)
  }

  // 出队
  shiftMsgArr(){
    if (!this.isEmpty()){
      return this.msgArr.shift()
    }else{
      return false
    }
  }

  isEmpty(){
    return this.getSize()?false : true
  }
  
}

module.exports = Msg

// const a = {one:new Msg('wyd','xbl')}
// console.log(a.one.getMsg())

// const a = new Map()
// a.set('dd',new Msg('wyd','xbk'))
// a.get('dd').pushMsgArr('chisidai')
// a.get('dd').pushMsgArr('chisidai')
// a.get('dd').pushMsgArr('chisidai')
// a.get('dd').pushMsgArr('chisidai')
// console.log(a.get('dd').getMsg())