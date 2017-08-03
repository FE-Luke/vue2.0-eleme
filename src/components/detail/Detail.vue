<template>
  <div class="detail">
    <div class="detail-wrapper clearfix">
      <div class="detail-content">
        <h1 class="name">{{seller.name}}</h1>
        <v-star :score="seller.score" :size="48" class="seller-score"></v-star>
        <div class="title">
          <div class="line"></div>
          <div class="text">优惠信息</div>
          <div class="line"></div>
        </div>
        <ul v-if="seller.supports" class="support">
          <li class="support-item" v-for="item in seller.supports">
            <span class="icon" :type="item.type"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
        <div class="title">
          <div class="line"></div>
          <div class="text">商家公告</div>
          <div class="line"></div>
        </div>
        <div class="bulletin">
          <p class="content">{{seller.bulletin}}</p>
        </div>
      </div>
    </div>
    <div class="detail-close" @click="detailHide">
      <i class="icon-close"></i>
    </div>

  </div>
</template>

<script>
  import Star from '@/components/star/Star';
  export default{
    name: 'Detail',
    props: ['seller', 'detailShow'],
    methods: {
      detailHide () {
        this.$emit('update:detailShow', false);
      }
    },
    components: {
      'v-star': Star
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin"

  .detail
    position fixed
    z-index 666
    top 0
    left 0
    width 100%
    height 100%
    overflow auto
    background rgba(7, 17, 27, 0.8)
    transition all 0.3s ease
    //style for safari mobile.
    -webkit-overflow-scrolling touch
    -webkit-backdrop-filter blur(10px)
    &.fade-enter,&.fade-leave-to
      opacity 0
      background rgba(2, 17, 27, 0);
    .detail-wrapper
      width 100%
      min-height 100%
      .detail-content
        box-sizing border-box
        padding 64px 36px;
        overflow auto
        .name
          line-height 16px
          text-align center
          font-weight 700
          font-size 16px
        .seller-score
          text-align center
          margin-top 18px
          padding 2px 0
        .title
          display flex
          width 100%
          margin 28px auto 24px auto
          .line
            flex 1
            position relative
            top -6px
            border-bottom 1px solid rgba(255,255,255,0.2)
          .text
            box-sizing border-box
            padding 0 12px
            font-weight 700
            font-size 14px
        .support
          width 100%
          .support-item
            box-sizing border-box
            padding 0 12px
            margin-bottom 12px
            font-size 0
            &:last-child
              margin-bottom 0
            .icon
              display inline-block
              vertical-align top
              width 16px
              height 16px
              margin-right 6px
              background-size 16px 16px
              background-repeat no-repeat
              &[type="0"]
                bg-image('images/decrease_2')
              &[type="1"]
                bg-image('images/discount_2')
              &[type="2"]
                bg-image('images/special_2')
              &[type="3"]
                bg-image('images/invoice_2')
              &[type="4"]
                bg-image('images/guarantee_2')
          .text
            line-height 16px;
            font-size 12px;
        .bulletin
          .content
            padding 0 12px
            line-height 24px
            font-size 12px
    .detail-close
      position relative
      width 32px
      height 32px
      margin -64px auto
      clear both
      font-size 32px
</style>
