module.exports = (max,acount)=>{
  let arr = []
  if(max === acount){
    for(let i = 1;i<=max;i++){
      arr.push(i)
    }
  }else{
    while(arr.length<acount){
      const a = Math.floor(Math.random()*max+1)
      if(!isRepeat(arr,a)){
        arr.push(a)
      }
    }
  }
  arr = arr.sort((a,b)=>a-b)
  return arr
}

const isRepeat = (arr,val)=>{
  const index = arr.findIndex((va)=>{
    return va === val
  })
  return index>=0
}