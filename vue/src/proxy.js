function trigger(target){
  setTimeout(()=>{
    console.log(target,'触发试图更新')
  })
}
function isObject(x){
  return typeof x === 'object' && x !== null
}

function reactive(target){
  if(!isObject(target)){
    return target
  }
  const handlers = {
    //数据读取触发get()方法
    get(target,key,value,receiver){
      const res = Reflect.get(target,key,value,receiver)
      return res
    },
    //数据设置触发set()方法
    set(target,key,receiver){
      if(target.hasOwnProperty(key)){
        trigger(target)
      }
      const res = Reflect.set(target,key,receiver)
      return res
    },
    //数据删除触发deleteProperty()方法
    deleteProperty(target,key){
      const res = Reflect.deleteProperty(target,key)
      return res
    }
  }
  const observerd = new Proxy(target,handlers)
  return observerd
}
//对象
let obj = {
  name:'zyd',
  age:26
}
let obj_= reactive(obj)
// obj_.name = 'zyd1'
//数组
let arr = new Array(5).fill().map((item,i)=>i)
let arr_ =  reactive(arr)
arr_.push(5)
// arr_[1] = 100
// arr_[100] = 100
// arr_.length = 0

