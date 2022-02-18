const computed = (apiData,reqBody)=>{
  /*
    apiData:[
      [{subject_id:"0001",subject_result:'2'},{subject_id:"0002",subject_result:'2'}],
      [{subject_id:"000001",subject_result:'1'}],
      [{subject_id:"0000001",subject_result:'3'}],
    ]
    reqBody:{
      "0":{0001:"0",0002:"2",0003:"3"},
      "1":{00001:"0"},
      "2":{000001:"0"},
    }
  */
  let zq = 0
  let count = 0
  let errId = {0:[],1:[],2:[]}  
  let apiObj = {0:{},1:{},2:{}}
  apiData.forEach((val,ind)=>{
    //val =  [{},{}]
    for(let j=0;j<val.length;j++){
      count++
      apiObj[ind][`${val[j].subject_id}`] = val[j].subject_result
    }
  })

  for(let k in apiObj){
    for(let sk in apiObj[k]){
      if(apiObj[k][sk]===reqBody[k][sk]){
        zq++
      }else{
        errId[k].push(sk)
      }
    }
  }
  return {apiObj,count,zq,errId}
}

module.exports = computed