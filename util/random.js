module.exports =(obj,acount)=>{
  let list = obj.listId
  let max = list.length
  if(max<acount){return false}
  let arr = []
  // if(max === acount){
  //   for(let i = 0;i<max;i++){
  //     arr.push(list[i])
  //   }
  // }else{
    let count = 1
    while (count<=acount){
      // a随机下标
      const a = Math.floor(Math.random()*max)
      if(!isRepeat(arr,list[a])){
        arr.push(list[a])
        count++
      }
    }
  // }
  arr = arr.sort((a,b)=>a-b)
  return arr
}

const isRepeat = (arr,cur)=>{
  const index = arr.findIndex(val=>{
    return val === cur
  })
  return index>=0
}