<!-- 吸顶导航 -->
<template>
  <div>
    <ul class="list">
      <li v-for="() in products"></li>
    </ul>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  setup(){
    let states = reactive({
      list:[]
    })
  }
}
</script>
<style>
*{
  margin: 0;
  padding: 0;
  list-style: none;
}
ul li{
  height: 20vh;
  margin: 30px;
  border: 1px solid #000;
}
</style>