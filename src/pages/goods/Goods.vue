<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menu-wrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item border-1px" :class="{'current':currentIndex == index}" @click="switchMenu(index,$event)">
          <span class="text">
            <span v-show="item.type > 0" class="icon" :type="item.type"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foods-wrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
              <div class="icon">
                <img :src="food.icon" width="56" height="56">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span><span v-if="food.rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="nowPrice">￥{{food.price}}</span><span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <v-cart-control class="cart-control" :food="food" @cart_add="_drop"></v-cart-control>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-food :food="selectedFood" :cart="cartComponent" ref="v-food"></v-food>
    <v-cart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="cart"></v-cart>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import Cart from '@/components/cart/Cart';
  import CartControl from '@/components/cartControl/cartControl';
  import Food from '@/components/food/Food';
  import {mapGetters, mapMutations} from 'vuex';

  const XHR_OK = 0;

  export default {
    name: 'goods',
    data () {
      return {
        cartComponent: {},
        goods: [],
        listHeight: [],
        selectedFood: {},
        menuWrapperHeight: 0,
        menuItemHeight: 0,
        scrollY: 0
      };
    },
    async created () {
      try {
        let {data} = await this.$http.get('/api/goods');
        if (data.code === XHR_OK) {
          this.goods = data.data;
          let mountedTime = new Date().getTime();
          this.$nextTick(() => {
            let tickTime = new Date().getTime();
            console.log('DOM Render Time : ' + (tickTime - mountedTime) + 'ms.');
            this.cartComponent = this.$refs['cart'];
            this._initScroll();
            this._calcHeight();
          });
        }
      } catch (e) {
      }
    },
    methods: {
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs['menu-wrapper'], {
          click: true
        });
        this.foodScroll = new BScroll(this.$refs['foods-wrapper'], {
          probeType: 3,
          click: true
        });
        this.foodScroll.on('scroll', (position) => {
          this.scrollY = Math.abs(Math.round(position.y));
        });
      },
      _calcHeight () {
        this.menuWrapperHeight = this.$refs['menu-wrapper'].clientHeight;
        this.menuItemHeight = this.$refs['menu-wrapper'].querySelector('.menu-item').clientHeight;
        let foodList = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      _drop (el) {
        // 异步执行动画，避免同时进行多个动画可能造成的性能问题。
        this.$nextTick(() => {
          this.$refs.cart.drop(el);
        });
      },
      switchMenu (index, event) {
        if (!event._constructed) {
          return;
        }
        this.foodScroll.scrollTo(0, this.listHeight[index] * -1, 300);
      },
      selectFood (food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs['v-food'].toggleDisplay();
      },
      ...mapMutations(['SET_CART'])
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (this.scrollY >= height1 && this.scrollY < height2) {
            return i;
          }
        }
        return 0;
      },
      computedCart () {
        let cart = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              cart.push(food);
            }
          });
        });
        return cart;
      },
      ...mapGetters(['seller'])
    },
    watch: {
      currentIndex (newValue) {
        let nowMenuHeight = (newValue + 1) * this.menuItemHeight;
        let newMenuHeight = 0;
        if (nowMenuHeight > this.menuWrapperHeight) {
          newMenuHeight = nowMenuHeight - this.menuWrapperHeight;
        } else {
          newMenuHeight = 0;
        }
        this.menuScroll.scrollTo(0, newMenuHeight * -1, 300);
      },
      computedCart (newValue) {
        this.SET_CART(newValue);
      }
    },
    components: {
      'v-cart': Cart,
      'v-cart-control': CartControl,
      'v-food': Food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin"

  .goods
    display flex
    position absolute
    width 100%
    top 174px
    bottom 46px
    overflow hidden
    .menu-wrapper
      flex 0 0 21%
      width 21%
      background #f3f5f7
      .menu-item
        display table
        width 100%
        box-sizing border-box
        padding 0 15%
        height 54px
        line-height 14px
        font-weight 200
        &.current
          position relative
          z-index 10
          height 55px
          padding-top 1px
          margin-top -1px
          background #fff
          .text
            font-weight 700
            margin-top 1px
            border-none()
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &[type="0"]
            bg-image('images/decrease_3')
          &[type="1"]
            bg-image('images/discount_3')
          &[type="2"]
            bg-image('images/special_3')
          &[type="3"]
            bg-image('images/invoice_3')
          &[type="4"]
            bg-image('images/guarantee_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size 12px
          border-1px(rgba(7, 17, 27, 0.1))
    .foods-wrapper
      flex 1
      background #fff
      .title
        padding 0 14px
        height 26px;
        line-height 26px;
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 56px
          margin-right 10px
        .content
          flex 1
          position relative
          .name
            font-size 14px
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            color rgb(7, 17, 27)
          .desc, .extra
            margin-bottom 8px
            font-size 10px
            color rgb(147, 153, 159)
          .desc
            line-height 12px
          .extra
            & > span:first-of-type
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
            right 0
            bottom -6px
</style>
