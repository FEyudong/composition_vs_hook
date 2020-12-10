import { onMounted, computed } from "vue";
export default (target,st) => {
//vue的响应式原理，是主动侦测，非react的整体刷新，所以setup只执行一次，普通的变量就可以保存状态，而hook想保留一个变量，需要ref包装一下。
let scrollDistance = 0;
  onMounted(async () => {
    scrollDistance = target.value.offsetTop;
  });
  let isFixed = computed(() => {
    return st.value > scrollDistance
  });
  return isFixed;
};
