import {ref,onMounted,onUnmounted} from 'vue'
export default (target=window)=>{
  let top = ref(0)
  const onChange = (e) => {
    const st = document.body.scrollTop||document.documentElement.scrollTop;
    top.value = st || 0
  };
  onMounted(() => {
    target.addEventListener("scroll", onChange);
  });
  onUnmounted(() => {
    target.removeEventListener("scroll", onChange);
  });
  return top
}