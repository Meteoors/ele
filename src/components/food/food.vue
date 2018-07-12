<template>
  <transition name='move'>
    <div class='food' v-show='isShow' ref='food'>
      <div class='food-content'>
        <div class='pic'>
          <img :src="food.image">
          <div class='close icon-arrow_lift' @click="show(false)"></div>
        </div>

        <div class='content'>
          <div class='name'>{{food.name}}</div>
          <div class='desc'>
            <span class='count'>月售{{food.sellCount}}份</span>
            <span class='rating'>好评率{{food.rating}}%</span>
          </div>
          <div class='price'>
            <span class='now'>￥{{food.price}}</span>
            <span class='old' v-show='food.oldPrice'>￥{{food.oldPrice}}</span>
            <div class='add-wrapper'>
              <div class='add' v-if='!food.count' @click='updateFoodCount(food, true, $event)'>加入购物车</div>
              <cartcontrol v-else :food='food' :updateFoodCount='updateFoodCount'></cartcontrol>
            </div>
          </div>
        </div>

        <split></split>

        <div class='info'>
          <h2 class='title'>商品介绍</h2>
          <p class='content' v-show='food.info'>{{food.info}}</p>
        </div>

        <split></split>

        <div class='ratings-wrapper'>
          <h2 class='title'>商品评价</h2>

          <ratingselect @setSelectType='setSelectType'
                        @switchContentOnly='switchContentOnly'
                        :ratings='food.ratings'
                        :selectType='selectType'
                        :contentOnly='contentOnly'
                        :desc='desc'
          ></ratingselect>

          <ul>
            <li class='rating' v-for='rating in filterRatings'>
              <div class='time'>{{getTime(rating.rateTime)}}</div>
              <div class='user'>
                <span class='name'>{{rating.username}}</span>
                <img class='avatar' :src="rating.avatar">
              </div>
              <div class='text'>
                <span :class='rating.rateType===0 ? "icon-thumb_up" : "icon-thumb_down"'></span>
                {{rating.text}}
              </div>
            </li>
          </ul>

          <div class='no-rating' v-if='!food.ratings'>暂无评价</div>

        </div>

      </div>
    </div>
  </transition>
</template>

<script>
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'

  Date.prototype.toLocaleString = function(){
    return `${this.getFullYear()}-${this.getMonth() + 1}-${this.getDate()}  ${this.getHours()}:${this.getMinutes()}`
  }

  export default {
    data () {
      return {
        isShow: false,
        selectType: 2,  //all=2, good=0, bad=1
        contentOnly: true
      }
    },

    props: {
      food: Object,
      updateFoodCount: Function
    },

    created () {
      this.desc = {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    },

    methods: {
      show (isShow) {
        this.isShow = !this.isShow

        if(isShow){
          Vue.nextTick(() => {
            if(!this.scroll) {
              this.scroll = new BScroll(this.$refs.food, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
      },

      setSelectType (selectType) {
        this.selectType = selectType

        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      
      switchContentOnly() {
        this.contentOnly = !this.contentOnly

        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },

      getTime(seconds){
        var time = new Date(seconds)
        return time.toLocaleString()
      }

    },

    computed: {
      filterRatings () {      //由selectType和contentOnly共同决定
        if(!this.food.ratings){
          return
        }

        const ratings = this.food.ratings
        var arr = []

        if(this.selectType === 2){
          arr = ratings
        }else if(this.selectType === 0){
          arr = ratings.filter((rating) => {
            return rating.rateType === 0
          })
        }else if(this.selectType === 1){
          arr = ratings.filter((rating) => {
            return rating.rateType === 1
          })
        }

        if(this.contentOnly){
          arr = arr.filter((rating) => {
            return !!rating.text
          })
        }

        return arr
      }
    },

    components: {
      split,
      cartcontrol,
      ratingselect
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/stylus/mixins.styl"

  .food
    position fixed
    left 0
    top 0
    width 100%
    bottom 48px
    z-index 30
    background #fff 

    &.move-enter-active, &.move-leave-active 
      transition all .2s linear 
    &.move-enter, &.move-leave-active 
      opacity 0
      transform translate3d(100%, 0, 0) 

    .pic
      position relative
      width 100%
      height 100%
      img 
        width 100%
        height 100%
      .icon-arrow_lift
        position absolute
        font-size 20px
        color #fff 
        left 0
        top 10px
        padding 10px

    .content
      padding 18px
      position relative
      .name
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
        line-height 14px
        margin-bottom 8px
      .desc
        font-size 0
        color rgb(147,153,159)
        line-height 10px
        height 10px
        margin-bottom 18px
        .count, .rating
          font-size 10px
        .count
          margin-right 12px
      .price
        line-height 24px
        height 24px
        font-size 0
        .now
          display inline-block
          font-size 14px
          font-weight 700
          color rgb(240,20,20)
          vertical-align top
          margin-right 10px
        .old
          display inline-block
          font-size 10px
          font-weight 700
          color rgb(147,153,159)
          vertical-align top
          text-decoration line-through
        .add-wrapper
          position absolute
          right 18px
          bottom 18px
          .add
            width 84px
            text-align center
            height 24px
            line-height 24px
            font-size 10px
            color rgb(255,255,255)
            background rgb(0,160,220)
            border-radius 12px

    .info
      padding 18px
      .title
        font-size 14px
        line-height 14px
        margin-bottom 6px
        color rgb(7,17,27)
      .content
        font-size 12px
        line-height 24px
        padding 0 8px
        font-weight 200
        color rgb(77,85,93)

    .ratings-wrapper 
      .title
        margin 18px 18px 0 18px
        font-size 14px
        line-height 14px
        color rgb(7,17,27)
      ul
        padding 0 18px
        .rating
          padding 16px 0
          position relative
          border-1px(rgba(7,17,27,0.1))
          .time
            font-size 10px
            color rgb(147,153,159)
            line-height 12px
            margin-bottom 6px
          .user
            font-size 0
            position absolute 
            line-height 12px
            top 16px
            right 0
            .name
              display inline-block
              font-size 10px
              color rgb(147,153,159)
              padding-right 6px
              vertical-align top
            .avatar
              height 12px
              width 12px
              border-radius 6px
          .text
            font-size 12px
            line-height 16px
            color rgb(7,17,27)
            .icon-thumb_up, .icon-thumb_down
              display inline-block
              padding-right 4px
              font-size 12px
              line-height 16px
            .icon-thumb_down
              color rgb(147,153,159)
            .icon-thumb_up
              color rgb(0,160,220)
      
      .no-ratings
        padding 16px 0
        font-size 12px
        color rgb(147,153,159)

</style>
