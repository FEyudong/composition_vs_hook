<!-- 吸顶导航 -->
<template>
  <div>
    <ul class="list">
      <li v-for="() in list"></li>
    </ul>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive } from "vue";
export default {
  setup() {
    const onChange = (e) => {
      console.log(e);
    };
    onMounted(() => {
      window.addEventListener("scroll", onChange);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", onChange);
    });
  },
};
</script>
<style scoped>

</style>
