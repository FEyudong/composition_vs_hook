let offset = 0
export const getListApi = ()=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      const data = new Array(10).fill().map((item,index)=>{
        return {
          id:offset+index+1,
          url:'//www.runoob.com/wp-content/uploads/2017/01/vue.png'
        }
      })
      offset+=10
      resolve({
        data,
        total:20
      })
    },2000)
  })
}