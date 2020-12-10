# vue3.0 的新变化

## 一、Proxy（核心原理）

- ### 动机

1. 由于 ES5 Object.definedProperty 的限制，Vue 不能检测数组和对象的一些特殊变化。

```
vue 2.x

// 对于Object类型

const vm = new Vue({
      data:{
        a:1
      }
    })

// vm.a 是响应式的

vm.b = 2
// vm.b 是非响应式的

// 对于Array类型

const vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的 （通过索引改变一个普通值）
vm.items.length = 2 // 不是响应性的 （修改length）

vue3.x
不存在这些限制。proxy是针对整个对象层面的代理拦截，而非defineProperty针对属性层面做的劫持。
```

Demo ==> Proxy  
2. Proxy 比 defineProperty 拥有更好的新标准的性能红利。

- ### 缺陷
  &nbsp;&nbsp;不支持 ie11 [兼容性测试](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## 二、 Composition-API （核心 Api）

字面理解：组合 Api（vue 希望通过功能函数的组合去实现逻辑拆分与复用）

- ## 动机

1. 横切点关注问题
   ![代码散落](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d05799744a6341fd908ec03e5916d7b6~tplv-k3u1fbpfcp-watermark.image)
   Options 与 Class Api，代码组织不够聚合，无法按功能去进行代码组织，导致代码散落在 data、生命周期、watch、computed 里。
2. 逻辑拆分与复用
   ![功能拆分](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4146605abc9c4b638863e9a3f2f1b001~tplv-k3u1fbpfcp-watermark.image)
   vue2.x 包含模版的代码复用方式可以通过提取组件解决；纯的计算方法，可以提取为公共方法；但有些不需要模版的公共逻辑（可能包含状态、事件、生命周期等），就很难抽取，之前的 mixin、高阶组件等方案也都有他们各自带来的弊端。  
   vue3.x 全新的 composition-Api，可以完美解决这个问题，用负责单一功能函数进行组合。

- ## 用法

  ### setup

  - setup 是新组件选项，(它充当在组件内部使用 Composition API 的入口点。)
    ```
      // book.vue
      export default {
          props: {
            title: String
          },
          setup(props,context:{attrs, slots, emit}) {
            console.log(props.title)
          }
      }
    ```
  - 调用时间

    严格意义不属于生命周期的范围，调用在 beforeCreate 之前，全局只调用一次。

  - 模板使用

    ```
      <template>
        <div>{{ count }} {{ object.foo }}</div>
      </template>

      <script>
        import { ref, reactive } from 'vue'

        export default {
          setup() {
            const count = ref(0)
            const object = reactive({ foo: 'bar' })

            // 必须return，才可以在模版上使用
            return {
              count,
              object
            }
          }
        }
      </script>
    ```

  - setup 函数里 this 并不是期望的组件实例，为 undefined，所以不要在 setup 访问 this，尽管这也毫无意义。

  ### reactive

  作用：用于实现对象数据类型的响应式侦测

  用法： 传入一个对象，返回值是一个经过 vue 代理过的响应式对象

  ```
    const Counter = {
      setup(){
        //reactive实现响应式，适用于一组值
        const state = reactive({
          count:0
        })
        const add =()=>{
          state.count ++
        }
        //返回一个代理后的对象，用来实现响应式
        console.log(state)
        return {
          state,
          add
        }
      },
      template:`<h1>{{state.count}}</h1><button @click="add">+</button>`,
    };
  ```

  ### ref
  作用：用于实现任何值包括基础值（例：String、Number）的响应式侦测

  用法：传入一个值，返回一个 vue 内部包装过的{value:xxx}响应式引用对象，并且改变 value 属性可以触发响应式更新,用于模版渲染时，不用.value 这样去访问,vue 内部会自动拆包。

  为什么这样设计？  
  1. vue用的响应式侦测手段（defineProperty或者Proxy）无法针对一个普通值进行观测，只能通过一个对象间接的用代理或者属性劫持的方式去实现监测。
  2. 因为在JavaScript中，原始类型（例如Number或）String是通过值而不是通过引用传递的。
    ![按值还是按引用传递的差别](https://blog.penjee.com/wp-content/uploads/2015/02/pass-by-reference-vs-pass-by-value-animation.gif)
  
  ```
    const Counter = {
      setup(){
        //ref实现响应式，适合单个值场景
        const count = ref(0)
        const add =()=>{
          count.value ++
        }
        console.log(count)
        return {
          count,
          add
        }
      },
      template:`<h1>{{count}}</h1><button @click="add">+</button>`,
    };
  ```
  ref常见的.value问题  
  问题有多严重？：[前端人因为 Vue3 的 Ref-sugar 提案打起来了！](https://www.bilibili.com/read/cv8414218)  
  .value到底什么时候需要  
  (1) 如果自己的代码取值，需要  
  (2) watch等的api上，不需要（vue自动帮你做了拆包）  
  (3) 模版取值不需要  
  影响：造成开发体验上的割裂
  避免：并将所有的ref统一命名比如：xxxRef一定程度可以避免，或者使用ref:语法糖。
  ### toRef、toRefs ###
  作用：reactive返回的代理对象在组合函数的传递过程中，必须保持对返回对象的引用，以保证其响应式，该对象不能被ES6解构或属性拆解。  
  toRef方法
    ```
        const pos = reactive({
          x:0,
          y:0
        })
        //将响应式对象某一个属性转化为ref
        const xRef = useRef(pos,'x')
        const yRef = useRef(pos,'y')
    ```
  toRefs方法
  ```
      const pos = reactive({
          x:0,
          y:0
        })
        //将整个响应式对象的全部属性转化为ref，装在一个普通对象中
        const posRefsObj = useRefs(pos)
        //等价于
        const posRefsObj = {
            x:useRef(pos,'x')
            y:useRef(pos,'y')
        }
  ```  
  Demo演示这两个的作用

  ### computed ###
  作用： 与vue2.x一致，根据函数体内依赖的值的变化，计算出一个新值。
  用法： 传入一个计算函数，返回一个包装后的{value:xxx}响应式引用对象。  
    ```
      const Counter = {
            setup(){
                const state = reactive({
                  count:0
                })
                //计算count是否是偶数，字体切换红绿颜色
                let isOdd = computed(()=>state.count%2 === 0)
                const add =()=>{
                  state.count ++
                }
                return {
                  state,
                  isOdd,
                  add
                }
              },
              template:`<h1 :style="{'color':isOdd?'red':'green'}">{{state.count}}</h1><button @click="add">+</button>`,
          };
    ```
  ### watch ###
  作用： 与vue2.x一致，主动监测响应式数据，数据改变后，执行用户传入的回调。 
    ```
      const Counter = {
        setup(){
          //reactive实现响应式，适用于一组值
          const state = reactive({
            count:0
          })
          //计算count是否是奇数，字体切换红绿颜色
          let isOdd = computed(()=>state.count%2 === 0)
          
          watch(isOdd,(newValue)=>{
            alert(newValue?'偶数':"奇数")
          })
          const add =()=>{
            state.count ++
          }
          return {
            state,
            isOdd,
            add
          }
        },
        template:`<h1 :style="{'color':isOdd?'red':'green'}">{{state.count}}</h1><button @click="add">+</button>`,
      };
    ```
  ### 生命周期 ###
   <table>
   <thead>
   <tr>
   <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">选件API</font></font></th> <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">compositonAPI</th></tr></thead> <tbody>
   <tr><td><code>beforeCreate</code></td> <td><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">没有必要*</font></font></td></tr> 
   <tr><td><code>created</code></td> <td><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">没有必要*</font></font></td></tr> <tr><td><code>beforeMount</code></td> <td><code>onBeforeMount</code></td></tr> <tr><td><code>mounted</code></td> <td><code>onMounted</code></td></tr> <tr><td><code>beforeUpdate</code></td> <td><code>onBeforeUpdate</code></td></tr> <tr><td><code>updated</code></td> <td><code>onUpdated</code></td></tr> <tr><td><code>beforeUnmount</code></td> <td><code>onBeforeUnmount</code></td></tr> <tr><td><code>unmounted</code></td> <td><code>onUnmounted</code></td></tr></tbody></table>
 ### 与react-hook对比 ### 
 1. 心智负担不同  
 两者都会有一定的心智负担   
 **react-hook** 的问题担心频繁触发更新渲染，useEffect可以说是控制代码不被频繁执行最后的逃生舱，但是依赖项数组如果设置不正确，会导致副作用执行时机不正确，还可能会导致闭包旧值的bug; useCallBack经常总是需要，避免触发不必要的子组件渲染。
 **vue-compositonApi**的问题刚好相反，是经常担心触发不了更新，比如解构导致的响应式丢失，vue引入ref解决这个问题，，但引起了总是忘记写.value的新问题。
2. 对生命周期的看法不一样  
 **react-hook** 有意弱化生命周期的概念，转而倡导渲染副作用的概念，由数据变化引起渲染副作用的执行。另一个角度说react用useEffect实现了生命周期的聚合与封装。
 ```
  let [top,setTop] = useState(0)
  const onChange = (e) => {
    const st = document.body.scrollTop|| document.documentElement.scrollTop;
    setTop(st || 0)
  };
  //组件挂载，绑定副作用
  useEffect(() => {
    target.addEventListener("scroll", onChange);
    return ()=>{
      //组件卸载，清除副作用
      target.removeEventListener("scroll", onChange);
    }
  },[]); 
 ``` 
 **vue-compositonApi** 还是熟悉的vue2.x生命周期，没有新的理解成本
## 三、 其他

- teleport （传送）
- 组件不再限制只能存在一个根元素 
- data选项，都统一改成函数形式（之前根组件是对象，子组件是函数）
等等
- $children已废弃，只能通过ref获取组件及dom了。


