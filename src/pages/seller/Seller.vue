<template>
  <div class="seller">
    <div class="seller-wrapper" ref="seller">
      <div class="content">
        <div class="overview">
          <h1 class="title">{{seller.name}}</h1>
          <div class="desc border-1px">
            <v-star :size="36" :score="seller.score" class="star"></v-star>
            <span class="text">({{seller.ratingCount}})</span>
            <span class="text">月售{{seller.sellCount}}单</span>
          </div>
          <ul class="remark">
            <li class="block">
              <h2>起送价</h2>
              <div class="content">
                <span>{{seller.minPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>商家配送</h2>
              <div class="content">
                <span>{{seller.deliveryPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>平均配送时间</h2>
              <div class="content">
                <span>{{seller.deliveryTime}}</span>分钟
              </div>
            </li>
          </ul>
          <div class="favorite" @click="toggleFavorite">
            <span class="icon-favorite" :class="{active : favorite}"></span>
            <span class="text">{{favorite ? '已收藏' : '收藏'}}</span>
          </div>
        </div>
        <v-split></v-split>
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <div class="content-wrapper border-1px">
            <div class="content">
              {{seller.bulletin}}
            </div>
          </div>
        </div>
        <ul v-if="seller.supports" class="support">
          <li class="support-item border-1px" v-for="item in seller.supports">
            <span class="icon" :type="item.type"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
        <v-split></v-split>
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-wrapper" ref="pic-wrapper">
            <ul class="pic-list" ref="pic-list">
              <li class="pic-item" v-for="pic in seller.pics">
                <img :src="pic" width="120" height="90">
              </li>
            </ul>
          </div>
        </div>
        <v-split></v-split>
        <div class="info">
          <div class="title border-1px">商家信息</div>
          <ul v-if="seller.supports" class="info-wrapper">
            <li class="info-item border-1px" v-for="info in seller.infos">
              <span class="text">{{info}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import BScroll from 'better-scroll';
  import Star from '@/components/star/Star';
  import Split from '@/components/split/Split';
  import {mapGetters} from 'vuex';
  export default{
    name: 'seller',
    computed: mapGetters(['seller']),
    data () {
      return {
        favorite: true
      };
    },
    mounted () {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs['seller'], {
          click: true
        });
      });
      if (this.seller.pics) {
        this._initPicScroll();
      }
    },
    methods: {
      _initPicScroll () {
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        this.$refs['pic-list'].style.width = width + 'px';
        if (!this.picScroll) {
          this.picScroll = new BScroll(this.$refs['pic-wrapper'], {
            scrollX: true,
            eventPassthrough: 'vertical'
          });
        } else {
          this.picScroll.refresh();
        }
      },
      toggleFavorite (event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
      }
    },
    watch: {
      seller () {
        this.$nextTick(() => {
            this._initPicScroll();
            this.scroll.refresh();
        });
      }
    },
    components: {
      'v-star': Star,
      'v-split': Split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .seller
    position absolute
    top 174px
    left 0
    bottom 0
    width 100%
    overflow hidden
    .seller-wrapper
      width 100%
      height 100%
      overflow hidden
      .overview
        position relative
        padding 18px
        padding-bottom 0
        .title
          margin-bottom 8px
          line-height 14px
          font-size 14px
          color rgb(7,17,27)
        .desc
          padding-bottom 18px
          line-height 18px
          font-size 0
          border-1px(rgba(7,17,27,0.1))
          .star
            display inline-block
            height 14px
            vertical-align top
            margin-right 8px
          .text
            margin-right 12px
            line-height 14px
            font-size 10px
            color rgb(77,85,93)
        .remark
          display flex
          padding 18px 0
          .block
            padding-top 6px
            flex 1
            text-align center
            border-right 1px solid rgba(7,17,27,0.1)
            &:last-of-type
              border-right none
            h2
              margin-bottom 6px
              line-height 10px
              font-size 10px
              color rgb(147,153,159)
            .content
              line-height 24px
              font-size 10px
              color rgb(7,17,27)
              & span
                font-size 24px
                font-weight 200
                margin-right 2px

        .favorite
          position absolute
          top 18px
          right 18px
          text-align center
          font-size 0
          width 30px
          .icon-favorite
            display block
            color #d4d6d9
            line-height 24px
            font-size 24px
            margin-bottom 4px
            &.active
              color rgb(240,20,20)
          .text
            font-size 10px
            line-height 10px
            color rgb(77,85,93)
      .bulletin
        padding 18px 18px 0 18px
        .title
          margin-bottom 8px
          line-height 14px
          font-size 14px
          color rgb(7,17,27)
        .content-wrapper
          padding 0 12px 16px 12px
          border-1px(rgba(7,17,27,0.1))
          .content
            line-height 24px
            font-size 12px
            color rgb(240,20,20)
      .support
        box-sizing border-box
        width 100%
        padding 0 18px
        .support-item
          box-sizing border-box
          padding 16px 0
          font-size 0
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            margin-bottom 0
            border-none()
          .icon
            display inline-block
            vertical-align top
            width 16px
            height 16px
            margin-left 12px
            margin-right 6px
            background-size 16px 16px
            background-repeat no-repeat
            &[type="0"]
              bg-image('images/decrease_4')
            &[type="1"]
              bg-image('images/discount_4')
            &[type="2"]
              bg-image('images/special_4')
            &[type="3"]
              bg-image('images/invoice_4')
            &[type="4"]
              bg-image('images/guarantee_4')
        .text
          line-height 16px;
          font-size 12px;
      .pics
        padding 18px
        .title
          margin-bottom 12px
          line-height 14px
          font-size 14px
          color rgb(7,17,27)
        .pic-wrapper
          width 100%
          overflow hidden
          white-space nowrap
          .pic-list
            font-size 0
            .pic-item
              display inline-block
              margin-right 6px
              width 120px
              height 90
              &:last-of-type
                margin-right 0
      .info
        padding 18px 18px 0 18px
        .title
          padding-bottom 12px
          line-height 14px
          font-size 14px
          color rgb(7,17,27)
          border-1px(rgba(7,17,27,0.1))
        .info-wrapper
          box-sizing border-box
          width 100%
          .info-item
            box-sizing border-box
            padding 16px 12px
            font-size 0
            border-1px(rgba(7,17,27,0.1))
            &:last-child
              margin-bottom 0
              border-none()
          .text
            line-height 16px;
            font-size 12px;
            font-weight 200
</style>
