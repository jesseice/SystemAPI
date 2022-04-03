/**
 * @param whoMsg 谁的消息
 * @param whoSend 谁发送的
 */
// 离线消息处理类
class Msg {
  constructor(whoMsg) {
    this.whoMsg = whoMsg
    this.whoSends = [] // ['wuyingdong',"xiaobingkuai"]
    this.msgObj = new Map() // {'wuyingdong':[msg, msg, msg],'xiaobingkuai:[msg, msg, msg]'} 
  }

  // 装载聊天数据
  inputMsg(whoSend,msg){
    if(!msg){return false}
    //初始时判断
    if(this.isOnce(whoSend)){
      this.whoSends.push(whoSend)

      this.msgObj.set(whoSend, [])
    }

    this.pushMsgArr(whoSend, msg)
  }

  // 输出聊天记录
  outputMsg(whoSend){
    if(!this.isEmpty(whoSend)){
      return this.msgObj.get(whoSend).shift()
    }
  }

  // 判断whoSend是否是第二条消息发到这个whoMsg
  isOnce(whoSend){
    return !this.msgObj.has(whoSend)
  }

  // 获取  谁的消息
  getWhoMsg() {
    return this.whoMsg
  }
  // 获取有谁发的
  getWhoSends() {
    return this.whoSends
  }

  // 获取whoSend发的消息
  getMsg(whoSend) {
    return this.msgObj.get(whoSend)
  }

  // whoSend发的消息长度
  getSize(whoSend) {
    return this.getMsg(whoSend).length
  }
  // 入栈
  pushMsgArr(whoSend,msg) {
    this.msgObj.get(whoSend).push(msg)
  }

  // 是否为空
  isEmpty(whoSend){
    return this.getSize(whoSend) === 0
  }
}

module.exports = Msg

const c = new Msg('wuyingdong')
c.inputMsg('xiaobaobao', '睡觉没有')
c.inputMsg('xiaobingkuai','吃饭没有')
c.inputMsg('xiaobingkuai','没吃就来我家吃')
c.inputMsg('xiaobaobao','没睡就来这里睡')
console.log(c.getWhoSends().length);
for (let i = 0; i < c.getWhoSends().length; i++){
  let whoSend = c.getWhoSends()[i]
  let length = c.getSize(whoSend)
  for (let index = 0; index < length; index++) {
    console.log(`${whoSend}发的消息:`,c.outputMsg(whoSend))
  }
}