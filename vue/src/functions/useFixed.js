import { onMounted, computed } from "vue";
export default (target,st) => {
let scrollDistance = 0;
  onMounted(async () => {
    scrollDistance = target.value.offsetTop;
  });
  let isFixed = computed(() => {
    return st.value > scrollDistance
  });
  return isFixed;
};
