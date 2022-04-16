module.exports =(obj, acount)=>{
  let list = [...obj.listId]
  if(list.length < acount){ return false }
  if(list.length === acount){ return list }
  let arr = []
  // 循环次数acount
  for (let i = 0; i < acount; i++){
    const index = Math.floor(Math.random() * list.length)
    const res = list.splice(index, 1)
    arr.push(...res)
  }
  arr = arr.sort((a,b)=>a-b)
  return arr
}