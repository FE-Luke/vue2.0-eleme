<template>
  <div class="ratings">
    <div class="ratings-wrapper" ref="rating">
      <div class="rating-content">
        <div class="overview">
          <div class="overview-left">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="overview-right">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <v-star :score="seller.serviceScore" :size="36" class="seller-score"></v-star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <v-star :score="seller.foodScore" :size="36" class="seller-score"></v-star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">送达时间</span>
              <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <v-split></v-split>
        <v-rating-select :ratings="ratings" :ratingType.sync="ratingType" :onlyContent.sync="onlyContent"></v-rating-select>
        <div class="rating-list">
          <ul v-if="ratings && ratings.length">
            <li v-for="rating in ratings" class="rating-item border-1px" v-show="showRating(rating.rateType,rating.text)">
              <div class="avatar">
                <img :src="rating.avatar" width="28" height="28">
              </div>
              <div class="content">
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <v-star :size="24" :score="rating.score" class="star"></v-star>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                </div>
                <p class="text">{{rating.text}}</p>
                <div class="recommend" v-if="rating.recommend && rating.recommend.length">
                  <span :class="{'icon-thumb_up' : rating.rateType === 0 , 'icon-thumb_down' : rating.rateType === 1}"></span>
                  <span v-for="item in rating.recommend" class="item">{{item}}</span>
                </div>
                <div class="time">{{rating.rateTime | formatTimeStamp}}</div>
              </div>
            </li>
          </ul>
          <div v-else class="no-rating">
            暂无评 价
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import {mapGetters} from 'vuex';
  import BScroll from 'better-scroll';
  import Star from '@/components/star/Star';
  import Split from '@/components/split/Split';
  import RatingSelect from '@/components/ratingSelect/RatingSelect';
  import formatTime from '@/common/js/date';

  const XHR_OK = 0;

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default{
    name: 'ragings',
    async created () {
      try {
        let {data} = await this.$http.get('/api/ratings');
        if (data.code === XHR_OK) {
          this.ratings = data.data;
          let mountedTime = new Date().getTime();
          this.$nextTick(() => {
            let tickTime = new Date().getTime();
            console.log('DOM Render Time : ' + (tickTime - mountedTime) + 'ms.');
            this.scroll = new BScroll(this.$refs['rating'], {
              click: true
            });
          });
        }
      } catch (e) {}
    },
    data () {
      return {
        ratings: [],
        ratingType: ALL,
        onlyContent: true
      };
    },
    methods: {
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
    computed: mapGetters(['seller']),
    watch: {
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
      'v-star': Star,
      'v-split': Split,
      'v-rating-select': RatingSelect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .ratings
    position absolute
    top 174px
    left 0
    bottom 0
    width 100%
    overflow hidden
  .ratings-wrapper
    width 100%
    height 100%
    .overview
      display flex
      box-sizing border-box
      padding 18px 0
      .overview-left
        flex 0 0 36.7%
        width 36.7%
        border-right 1px solid rgba(7,17,27,0.1)
        text-align center
        padding 6px 0
        @media only screen and (max-width:320px)
          flex 0 0 34%
          width 34%
        .score
          line-height 28px
          font-size 24px
          color rgb(255,153,0)
          margin-bottom 6px
        .title
          line-height 12px
          font-size 12px
          color rgb(7,17,27)
          margin-bottom 8px
        .rank
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
      .overview-right
        flex 0 0 63.3%
        width 63.3%
        padding 6px 0
        padding-left 6%
        @media only screen and (max-width:320px)
          flex 0 0 66%
          width 66%
          padding-left 3%
          .seller-score
            margin 0 6px
        .score-wrapper
          margin-bottom 8px
          height 16px
          line-height 16px
          font-size 0
          &:last-of-type
            margin-bottom 0
          .title
            font-size 12px
            color rgb(7,17,27)
            line-height 18px
          .seller-score
            display inline-block
            vertical-align top
            height 16px
            line-height 16px
            margin 0 12px
          .score
            font-size 12px
            line-height 16px
            color rgb(255,153,0)
          .deliveryTime
            margin 0 12px
            font-size 12px
            color rgb(147,153,159)
    .rating-list
      padding 0 18px;
      .rating-item
        display flex
        padding 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex 0 0 28px
          width 28px
          height 28px
          border-radius 50%
          margin-right 12px
          overflow hidden
        .content
          flex 1
          position relative
          .name
            line-height 12px
            font-size 10px
            color rgb(7,17,27)
            margin-bottom 4px
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              vertical-align top
              margin-right 6px
            .delivery
              font-size 10px
              color rgb(147,153,159)
          .text
            line-height 18px
            font-size 12px
            color rgb(7,17,27)
            margin-bottom 8px
          .recommend
            line-height 16px
            font-size 0
            .item
              display inline-block
              vertical-align top
              margin 0 8px 4px 0
              font-size 9px
              padding 0 6px
              border 1px solid rgba(7,17,27,0.1)
              border-radius 1px
              line-height 16px
              color rgb(147,153,159)
            .icon-thumb_up, .icon-thumb_down
              display inline-block
              vertical-align top
              line-height 16px
              font-size 12px
              margin-right 8px
              margin-bottom 4px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
          .time
            position absolute
            font-size 10px
            line-height 12px
            color rgb(147,153,159)
            top 0
            right 0
      .no-rating
        padding 16px 0
        font-size 12px
        color rgb(147,153,159)
</style>
