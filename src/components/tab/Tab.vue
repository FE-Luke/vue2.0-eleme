<template>
  <div class="tab border-1px">
    <div class="tab-item" :class="{active:$route.path == tabItem.path}" v-for="(tabItem,index) in menu" :key="index"
         @click="$router.push(tabItem.path)">{{tabItem.name}}
    </div>
  </div>
</template>

<script>
  import {menu} from '@/components/tab/menu.json';
  export default{
    name: 'tab',
    data () {
      return {
        menu
      };
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin"
  .tab
    display flex
    width 100%
    height 40px
    line-height 40px
    border-1px(rgba(7, 17, 27, 0.1))
    font-size 14px;
    color rgb(77, 85, 93)
    .tab-item
      flex 1
      text-align center
    .tab-item.active
      color: rgb(240, 20, 20)
</style>
