<template>
  <div class="cart-control">
    <transition name="move">
      <div class="cart-decrement icon-remove_circle_outline" v-show="food.count > 0" @click.stop.prevent="decrementCart($event)"></div>
    </transition>
    <div class="cart-count" :style="{visibility : food.count > 0 ? 'visible' : 'hidden'}">{{food.count}}</div>
    <div class="cart-increment icon-add_circle" @click.stop.prevent="incrementCart($event)"></div>
  </div>
</template>

<script>
  export default{
    name: 'CartControl',
    props: {
        food: {
            type: Object,
            require: true
        }
    },
    methods: {
        incrementCart (event) {
          if (!event._constructed) {
            return;
          }
          if (!this.food.count) {
            this.$set(this.food, 'count', 1);
          } else {
            this.$set(this.food, 'count', this.food.count + 1);
          }
          this.$emit('cart_add', event.target);
        },
        decrementCart (event) {
          if (!event._constructed) {
            return;
          }
          if (this.food.count) {
            this.$set(this.food, 'count', this.food.count - 1);
          }
        }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .cart-control
      font-size 0
      .cart-decrement, .cart-count ,.cart-increment
        display inline-block
        padding 6px
        font-size 24px
        line-height 24px
        color rgb(0,160,220)
      .cart-increment
        padding-left 0
      .cart-decrement
        padding-right 0
        transition all 0.3s ease
        transform-origin 18px center
        &.move-enter,&.move-leave-to
          opacity 0
          transform translate3D(48px,0,0) rotateZ(360deg)
      .cart-count
        vertical-align top
        padding 6px 4px
        font-size 12px
        line-height 24px
        min-width 24px
        text-align center
        color rgb(147,153,159)
</style>
