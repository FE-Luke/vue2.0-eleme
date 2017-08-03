<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :type="seller.supports[0].type"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%">
    </div>
    <transition name="fade">
      <v-detail v-show="detailShow" :seller="seller" :detailShow.sync="detailShow"></v-detail>
    </transition>
  </div>
</template>

<script>
  import Detail from '@/components/detail/Detail';
  export default{
    name: 'Header',
    props: ['seller'],
    data () {
      return {
        detailShow: false
      };
    },
    methods: {
      showDetail () {
        this.detailShow = true;
      }
    },
    components: {
      'v-detail': Detail
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .header
    position relative
    color #fff
    background-color rgba(7, 17, 27, 0.5)
    overflow hidden
    .content-wrapper
      position relative
      box-sizing border-box
      padding 24px 12px 18px 24px
      font-size 0
      .avatar
        display inline-block
        vertical-align top
        overflow hidden
        border-radius 2px
      .content
        display inline-block
        margin-left 16px
        .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            vertical-align top
            width 30px
            height 18px
            bg-image('images/brand')
            background-size 30px 18px
            background-repeat no-repeat
          .name
            margin-left 6px
            font-size 16px
            line-height 18px
            font-weight bold
        .description
          margin-bottom 10px
          line-height 12px
          font-size 12px
      .support-count
        position absolute
        right 12px
        bottom 14px
        padding 0 8px
        font-size 10px
        height 24px
        line-height 24px
        border-radius 14px
        background rgba(0, 0, 0, 0.2)
        text-align center
        .count
          font-size 10px
          vertical-align top
        .icon-keyboard_arrow_right
          line-height 24px
      .support
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 4px
          background-size 12px 12px
          background-repeat no-repeat
          &[type="0"]
            bg-image('images/decrease_1')
          &[type="1"]
            bg-image('images/discount_1')
          &[type="2"]
            bg-image('images/special_1')
          &[type="3"]
            bg-image('images/invoice_1')
          &[type="4"]
            bg-image('images/guarantee_1')
        .text
          line-height 12px;
          font-size 10px;
    .bulletin-wrapper
      position relative
      height 28px
      line-height 28px
      padding 0 22px 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      background rgba(7, 17, 27, 0.2)
      .bulletin-title
        display inline-block
        vertical-align top
        margin-top 8px
        width 22px
        height 12px
        bg-image('images/bulletin')
        background-size 22px 12px
        background-repeat no-repeat
      .bulletin-text
        vertical-align top
        margin 0 4px
        font-size 10px
      .icon-keyboard_arrow_right
        position absolute
        font-size 10px
        right 12px
        top 9px
    .background
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      z-index -1
      overflow hidden
      filter: blur(10px)
</style>
