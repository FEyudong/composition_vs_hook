<!-- 吸顶导航 -->
<template>
<div>
  <Loading :show="isFetching"></Loading>
  <header><h1>composition</h1></header>
  <nav ref="navRef"><div class="content" :class="{'fixed':isFixed}"><h3>{{isFixed?'Fixed':'NoFixed'}}</h3></div></nav>
  <div>
    <ul class="list">
      <li v-for="item in states.products" :key="item.id">
        <h1>{{ item.id }}</h1>
      </li>
    </ul>
    <div v-if="!hasMore && !isFetching" class="no-more">暂无更多</div>
  </div>
</div>

</template>
<script>
import Loading from './components/Loading.vue'
import { getListApi } from "./api/list.js";
import { onMounted,onUnmounted, reactive,ref, watch } from "vue";
import useScroll from './functions/useScroll.js'
import useFixed from './functions/useFixed.js'
import useLoadMore from './functions/useLoadMore.js'
export default {
  setup() {
    let states = reactive({
      products: [],//产品列表
    });
    let navRef = ref(null);//导航栏dom Ref
    //获取页面滚动高度
    let scrollTop = useScroll(window)
    //判断导航栏是否吸顶
    let isFixed = useFixed(navRef,scrollTop)
    //上拉加载更多
    let {isFetching,hasMore} = useLoadMore(scrollTop,async (pageParams)=>{
      const p = {
        ...pageParams
      }
      const {data,total} = await getListApi(p);
      states.products = [...states.products, ...data];
      return total
    })
    return {
      states,
      navRef,
      isFixed,
      hasMore,
      isFetching
    };
  },
  components:{
    Loading
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
header{
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  height: 200px;
}
nav{
  margin: 15px 0;
  text-align: center;
  height: 50px;
}
nav  .content{
    height: 50px;
    border: 1px solid red;
    line-height: 50px;
    background-color: #ffffff;
  }
nav .fixed{
  position: fixed;
  z-index: 1;
  top: 0;
  width: 100%;

}  
ul li {
  height: 20vh;
  margin: 15px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-more{
  text-align: center;
  line-height: 40px;
}
</style>
