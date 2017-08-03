<template>
  <div class="ratingSelect">
    <div class="rating-type border-1px">
      <span class="positive" :class="{active:ratingType === 2}" @click="changeRatingType(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="positive" :class="{active:ratingType === 0}" @click="changeRatingType(0,$event)">{{desc.positive}}<span class="count">{{computedRatings.positive.length}}</span></span>
      <span class="negative" :class="{active:ratingType === 1}" @click="changeRatingType(1,$event)">{{desc.negative}}<span class="count">{{computedRatings.negative.length}}</span></span>
    </div>
    <div class="switch" :class="{selected:onlyContent}" @click="toggleOnlyContent">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    name: 'RatingSelect',
    props: {
      ratings: {
        type: Array,
        default () {
          return [];
        }
      },
      ratingType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    methods: {
      changeRatingType (type, event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('update:ratingType', type);
      },
      toggleOnlyContent (event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('update:onlyContent', !this.onlyContent);
      }
    },
    computed: {
      computedRatings () {
        let positive = this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
        let negative = this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
        return {positive: positive, negative: negative};
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .ratingSelect
    .rating-type
      padding 18px
      font-size 0
      border-1px(rgba(7,17,27,0.1))
      & > span
        display inline-block
        padding 8px 12px
        border-radius 2px
        margin-right 8px
        height 16px
        line-height 16px
        font-size 12px
        color rgb(77,85,93)
        text-align center
        & .count
          font-size 8px
          margin-left 2px
        &.active
          color #fff
        &.positive
          background rgba(0,160,220,0.2)
          &.active
            background rgb(0,160,220)
        &.negative
          background rgba(77,85,93,0.2)
          &.active
            background rgb(77,85,93)
  .switch
    padding 12px 18px
    line-height 24px;
    border-bottom 1px solid rgba(7,17,27,0.1)
    color: rgb(147,153,159)
    font-size 12px
    .icon-check_circle
      display inline-block
      vertical-align top
      font-size 24px
    &.selected > .icon-check_circle
      color #00c850
</style>
