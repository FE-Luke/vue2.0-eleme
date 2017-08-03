<template>
  <div class="cart" @click="toggleList">
    <div class="cart-bar">
      <div class="content">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight:totalCount > 0}">
              <span class="icon-shopping_cart"></span>
            </div>
            <div class="badge" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight:totalPrice > 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" :class="{available:totalPrice >= minPrice}" @click.stop.prevent="pay">
          <div class="pay">
            {{payDesc}}
          </div>
        </div>
      </div>
      <transition name="drop" v-for="(ball,index) in balls" :key="index" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div v-show="ball.show" class="ball">
          <div class="inner inner-hook"></div>
        </div>
      </transition>
      <transition name="fold">
        <div class="cart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="emptyCart">清空</span>
          </div>
          <div class="list-content" ref="cart-list-content">
            <ul>
              <li class="food" v-for="cartItem in cart">
                <span class="name">{{cartItem.name}}</span>
                <div class="price">
                  ￥{{cartItem.price * cartItem.count}}
                </div>
                <v-cart-control class="cart-control" :food="cartItem"></v-cart-control>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click.stop.prevent="toggleList"></div>
    </transition>
  </div>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex';
  import BScroll from 'better-scroll';
  import CartControl from '@/components/cartControl/cartControl';

  export default {
    name: 'Cart',
    props: {
      deliveryPrice: {
        type: Number,
        default: 0,
        required: true
      },
      minPrice: {
        type: Number,
        default: 0,
        required: true
      }
    },
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    methods: {
      drop (el) {
        this.balls.forEach((ball) => {
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        });
      },
      beforeEnter (el) {
        this.balls.forEach((ball) => {
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 28;
            let y = (window.innerHeight - rect.top) * -1 + 44;
            el.style.display = '';
            el.style.webkitTransform = `translate3D(0,${y}px,0)`;
            el.style.transform = `translate3D(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3D(${x}px,0,0)`;
            inner.style.transform = `translate3D(${x}px,0,0)`;
          }
        });
      },
      enter (el) {
        el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3D(0,0,0)';
          el.style.transform = 'translate3D(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3D(0,0,0)';
          inner.style.transform = 'translate3D(0,0,0)';
        });
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      emptyCart () {
        this.cart.forEach((cartItem) => {
          cartItem.count = 0;
        });
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        alert('支付' + this.totalPrice + '元(不含运费)。');
      },
      ...mapMutations(['SET_CART'])
    },
    computed: {
      totalPrice () {
        let total = 0;
        this.cart.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount () {
        let count = 0;
        this.cart.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else {
            if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}元起送`;
            } else {
                return '去结算';
            }
        }
      },
      listShow () {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs['cart-list-content'], {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      },
      ...mapGetters(['cart'])
    },
    components: {
      'v-cart-control': CartControl
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin"

  .cart
    .cart-bar
      position fixed
      left 0
      bottom 0
      z-index 66
      width 100%
      background #000
      .content
        display flex
        height 48px
        background #141d27
        font-size 0
        .content-left
          flex 1
          height 100%
          .logo-wrapper
            display inline-block
            position relative
            top -10px
            margin 0 12px
            padding 6px
            border-radius 50%
            width 56px
            height 56px
            box-sizing border-box
            vertical-align top
            background #141d27
            z-index 66
            .logo
              width 100%
              height 100%
              border-radius 50%
              text-align center
              background rgba(255,255,255,0.2)
              .icon-shopping_cart
                font-size 24px
                line-height 44px
                color rgba(255,255,255,0.4)
              &.highlight
                background rgb(0,160,220)
                &  .icon-shopping_cart
                  color #fff
            .badge
              position absolute
              top 0
              right 0
              box-sizing border-box
              background rgb(240,20,20)
              min-width 16px
              height 16px
              line-height 17px
              border-radius 16px
              text-align center
              font-size 8px
              color #fff
              box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
          .price
            display inline-block
            vertical-align top
            margin-top 12px
            line-height 24px
            box-sizing border-box
            padding-right 12px
            border-right 1px solid rgba(255,255,255,0.1)
            font-size 16px
            font-weight 700
            color rgba(255,255,255,0.4)
            &.highlight
              color #fff
          .desc
            display inline-block
            vertical-align text-top
            line-height 24px;
            margin 12px 0 0 12px
            color rgba(255,255,255,0.4)
            font-size 10px
        .content-right
          flex 0 0 28%
          width 28%
          height 100%
          background rgba(255,255,255,0.2)
          &.available
            background #00b43c
            & .pay
              color #fff
          .pay
            width 100%
            height 100%
            text-align center
            line-height 48px
            color rgba(255,255,255,0.4)
            font-size 12px
            font-weight 700
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 60
        transition all 0.3s cubic-bezier(0.49,-0.49,0.75,0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background #00a0dc
          transition all 0.3s linear
      .cart-list
          position absolute
          top 0
          left 0
          z-index -1
          width 100%
          transition all 0.3s ease
          transform translate3d(0,-100%,0)
          &.fold-enter,&.fold-leave-to
            transform translate3d(0,0,0)
          .list-header
            height 40px
            line-height 40px
            padding 0 18px
            background #f3f5f7
            border-bottom 1px solid rgba(7,17,27,0.1)
            .title
              float left
              font-size 14px
              color rgb(7,17,27)
            .empty
              float right
              font-size 12px
              color rgb(0,160,220)
          .list-content
            padding 0 18px
            max-height 216px
            overflow hidden
            background #fff
            & li
              position relative
              padding 12px 0
              box-sizing border-box
              border-1px(rgba(7,17,27,0.1))
              .name
                line-height 24px
                font-size 14px
                color rgb(7,17,27)
              .price
                position absolute
                top 12px
                right 100px
                line-height 24px
                font-size 14px
                font-weight 700
                color rgb(240,20,20)
              .cart-control
                position absolute
                top 6px
                right 0
    .list-mask
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      z-index 60
      backdrop-filter blur(10px)
      background rgba(7,17,27,0.6)
      transition opacity 0.3s ease
      &.fade-enter,&.fade-leave-to
        opacity 0
</style>
