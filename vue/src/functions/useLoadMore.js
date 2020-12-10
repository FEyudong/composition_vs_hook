import { ref,toRefs,watch,onMounted, reactive, computed} from "vue";
export default (scrollTop,loadFn) => {
  const pageSize = 10
  //页面数据
  let pageStates = reactive({
    pageNum:1,
    total:0,
    isFetching:false,
  });
  // 有没有更多数据
  let hasMore = computed(()=>pageStates.pageNum * pageSize < pageStates.total)
  // 获取视口高度
  let getClientHeight = () => {
    return document.documentElement.clientHeight || document.body.clientHeight;
  };
  // 获取页面高度
  let getScrollHeight = () => {
    return document.documentElement.scrollHeight || document.body.scrollHeight;
  };
  onMounted(async ()=>{
    pageStates.isFetching = true
    pageStates.total = await loadFn({
      pageNum:pageStates.total,
      pageSize
    })
    pageStates.isFetching = false
  })
  watch(scrollTop,async (newValue) => {
      let clientHeight = getClientHeight(),
        scrollHeight = getScrollHeight();
      //滚动高度 + 可视区域高度 >= 页面高度 ==>  滚动条触底
      if (newValue + clientHeight < scrollHeight) {
        return 
      }
      //没有更多了
      if(!hasMore.value){
        return 
      }
      pageStates.pageNum ++
      pageStates.isFetching = true
      pageStates.total = await loadFn({
        pageNum:pageStates.pageNum,
        pageSize
      })
      pageStates.isFetching = false
    },
    {
      // immediate:true //立即执行参数不好使，文档里没有说明，可能是个bug
    }
  );
  return {
    ...toRefs(pageStates),
    hasMore
  }
};
