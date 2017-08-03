<template>
  <transition name="slide">
    <div class="food" v-show="display" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="toggleDisplay">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="nowPrice">￥{{food.price}}</span>
            <span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cart-control-wrapper">
            <v-cart-control class="cart-control" :food="food" @cart_add="_drop"></v-cart-control>
            <transition name="fade">
              <div class="addToCart" v-show="!food.count || food.count === 0" @click.stop.prevent="addToCart">加入购物车</div>
            </transition>
          </div>
        </div>
        <v-split v-show="food.info"></v-split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <span class="text">{{food.info}}</span>
        </div>
        <v-split></v-split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <v-rating-select :desc="desc" :ratings="food.ratings" :ratingType.sync="ratingType" :onlyContent.sync="onlyContent"></v-rating-select>
          <div class="rating-list">
            <ul v-if="food.ratings && food.ratings.length">
              <li v-for="rating in food.ratings" class="rating-item border-1px" v-show="showRating(rating.rateType,rating.text)">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatTimeStamp}}</div>
                <div class="text">
                  <span :class="{'icon-thumb_up' : rating.rateType === 0 , 'icon-thumb_down' : rating.rateType === 1}"></span>
                  {{rating.text}}
                </div>
              </li>
            </ul>
            <div v-else class="no-rating">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll';
  import CartControl from '@/components/cartControl/cartControl';
  import Split from '@/components/split/Split';
  import RatingSelect from '@/components/ratingSelect/RatingSelect';
  import formatTime from '@/common/js/date';

  /* eslint-disable no-unused-vars */
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
      name: 'Food',
      props: {
        food: {
          type: Object,
          required: true
        },
        cart: {
          type: Object,
          required: true
        }
      },
      data () {
        return {
          display: false,
          ratingType: ALL,
          onlyContent: true,
          desc: {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          }
        };
      },
      methods: {
        _drop (el) {
          // 异步执行动画，避免同时进行多个动画可能造成的性能问题。
          this.$nextTick(() => {
            this.cart.drop(el);
          });
        },
        toggleDisplay () {
          this.display = !this.display;
        },
        addToCart (event) {
          if (!event._constructed) {
            return;
          }
          this.$set(this.food, 'count', 1);
          this._drop(event.target);
        },
        showRating (ratingType, ratingText) {
          if (this.onlyContent && !ratingText) {
            return false;
          }
          if (this.ratingType === ALL) {
            return true;
          } else {
            return ratingType === this.ratingType;
          }
        }
      },
      filters: {
        formatTimeStamp (timeStamp) {
          return formatTime(timeStamp, 'yyyy-MM-dd hh:mm');
        }
      },
      watch: {
        display (newValue) {
          if (newValue) {
            this.ratingType = ALL;
            this.onlyContent = true;
            this.$nextTick(() => {
              if (!this.scroll) {
                this.scroll = new BScroll(this.$refs['food'], {
                  click: true
                });
              } else {
                this.scroll.refresh();
              }
            });
          }
        },
        ratingType () {
          if (this.scroll) {
            this.$nextTick(() => {
              this.scroll.refresh();
            });
          }
        },
        onlyContent () {
          if (this.scroll) {
            this.$nextTick(() => {
              this.scroll.refresh();
            });
          }
        }
      },
      components: {
        'v-cart-control': CartControl,
        'v-split': Split,
        'v-rating-select': RatingSelect
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .food
    position fixed
    left 0
    top 0
    right 0
    bottom 48px
    margin auto
    z-index 30
    background #fff
    transition all 0.3s ease
    transform translate3d(0,0,0)
    &.slide-enter,&.slide-leave-to
      transform translate3d(100%,0,0)
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      overflow hidden
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        display block
        padding 10px
        font-size 20px
        color #fff
    .content
      box-sizing border-box
      padding 18px
      position relative
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .detail
        margin-bottom 18px
        line-height 10px
        font-size 0
        & > span
          font-size 10px
          color rgb(147,153,159)
        .sell-count
          margin-right 12px
      .price
        line-height 24px;
        .nowPrice
          font-weight 700
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)
        .oldPrice
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
      .cart-control
        position absolute
        right 12px
        bottom: 12px
        z-index 6
      .addToCart
        position absolute
        right 18px
        bottom 18px
        z-index 8
        height 24px
        line-height 24px
        box-sizing border-box
        padding 0 18px
        font-size 10px
        border-radius 24px
        background rgb(0,160,220)
        color #fff
        transition all 0.2s ease
        opacity 1
        &.fade-enter,&.fade-leave-to
          opacity 0
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(77,85,93)
      .text
        display inline-block
        box-sizing border-box
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77,85,93)
        word-break break-all
    .rating
      .title
        margin 18px 0 0 18px
        line-height 14px
        font-size 14px
        color rgb(77,85,93)
      .rating-list
        padding 0 18px;
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display inline-block
              vertical-align top
              font-size 10px
              color rgb(147,153,159)
              margin-right 6px
            .avatar
              border-radius 50%
          .time
            margin-bottom 8px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
            .icon-thumb_up, .icon-thumb_down
              display inline-block
              vertical-align top
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147,153,159)
</style>
