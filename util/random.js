module.exports =(obj, acount)=>{
  let list = [...obj.listId]
  if(list.length < acount){ return false }
  let arr = []
  let len = list.length
  for(let i = 0; i<len; i++){
    const index = Math.floor(Math.random() * list.length)
    const res = list.splice(index, 1)
    arr.push(...res)
  }
  arr = arr.sort((a,b)=>a-b)
  return arr
}