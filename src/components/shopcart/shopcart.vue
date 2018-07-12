<template>
  <div>
    <div class='shopcart'>

      <div class='content'>
        <div class='content-left' @click='toggleList'>
          <div class='logo-wrapper'>
            <div class='logo' :class='{highlight: totalCount>0}'>
              <i class='icon-shopping_cart' :class='{highlight: totalCount>0}'></i>
            </div>
            <div class='num' v-if='totalCount'>{{totalCount}}</div>
          </div>
          <div class='price'>￥{{totalPrice}}</div>
          <div class='desc'>另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class='content-right' @click='pay'>
          <div class='pay' :class='{enough: totalPrice>=minPrice}'>
            {{payText}}
          </div>
        </div>
      </div>

      <div class='ball-container'>
        <transition name='drop' v-for='(ball, index) in balls' :key='index'
                    @before-enter='beforeDrop'
                    @enter='dropping'
                    @after-enter='afterDrop'
                    :css='false'>
          <div class='ball' v-show='ball.isShow'>
            <div class='inner'></div>
          </div>
        </transition>
      </div>

      <transition name='fold'>
        <div class='shopcart-list' v-show='listShow'>
          <div class='list-header'>
            <h1 class='title'>购物车</h1>
            <span class='empty' @click='clearCart'>清空</span>
          </div>
          <div class='list-content' ref='listContent'>
            <ul>
              <li class='food' v-for='food in foodList'>
                <span class='name'>{{food.name}}/{{food.count}}个</span>
                <span class='price'>￥{{food.price}}</span>
                <div class='cartcontrol-wrapper'>
                  <cartcontrol :food='food' :updateFoodCount='updateFoodCount'></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>

    </div>

    <transition name='fade'>
      <div class='list-mask' v-show='listShow' @click='toggleList'></div>
    </transition>

  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'

  export default {
    props: {
      foodList: Array,
      deliveryPrice: Number,
      minPrice: Number,
      clearCart: Function,
      updateFoodCount: Function
    },

    data () {
      return {
        isShow: false,
        balls: [
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false}
        ],
        droppingBalls: []
      }
    },

    computed: {
      totalCount () {
        return this.foodList.reduce((preTotal, food) => {
          return preTotal + food.count
        }, 0)
      },

      totalPrice () {
        return this.foodList.reduce((preTotal, food) => {
          return preTotal + food.count * food.price
        }, 0)
      },

      payText () {
        var totalPrice = this.totalPrice
        var minPrice = this.minPrice
        if(totalPrice === 0){
          return `￥${minPrice}元起送`
        }else if(totalPrice < minPrice){
          return `还差￥${minPrice - totalPrice}元起送`
        }else{
          return '去结算'
        }
      },

      listShow () {
        if(this.totalCount === 0){
          this.isShow = false
          return false
        }
        if(this.isShow){
          Vue.nextTick(() => {
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            }else{
              this.scroll.refresh()
            }
          })
        }
        return this.isShow
      }

    },

    methods: {
      toggleList () {
        this.isShow = !this.isShow
      },

      drop (startEl) {
        //找到隐藏的小球
        const ball = this.balls.find(ball => !ball.isShow)
        //显示隐藏的小球
        if(ball){
          ball.isShow = true  //显示
          ball.startEl = startEl
          this.droppingBalls.push(ball)
        }
      },

      //指定小球的起始位置
      beforeDrop (el) {
        
        //找到对应的小球
        const ball = this.droppingBalls.shift()

        var offsetX, offsetY

        const {left, top} = ball.startEl.getBoundingClientRect()
        const elLeft = 32
        const elBottom = 22
        offsetX = left - elLeft
        offsetY = top - (window.innerHeight - elBottom) 

        //指定transform初始样式
        el.style.transform = `translate3d(0, ${offsetY}px, 0)`
        el.children[0].style.transform = `translate3d(${offsetX}px, 0, 0)`

        //把ball保存到el上，动画结束时需要隐藏小球
        el.ball = ball
        console.log('before()', Date.now())
      },

      //指定小球的结束位置
      dropping (el) {
        //异步指定
        this.$nextTick(() => {
          //强制重排重绘
          var temp = el.clientHeight
          //指定transform最终样式
          el.style.transform = 'translate3d(0, 0, 0)'
          el.children[0].style.transform = 'translate3d(0, 0, 0)'
        })
        console.log('dropping()', Date.now())
      },

      //隐藏小球
      afterDrop (el) {
        //var temp = el.clientHeight
        console.log('after()', Date.now())
        //必须延迟更新状态
        setTimeout(() => {
          el.ball.isShow = false
        }, 400)
      },

      pay () {
        if(this.totalPrice >= this.minPrice){
          alert(`支付${this.totalPrice + this.deliveryPrice}元`)
        }
      }

    },

    components: {
      cartcontrol
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '../../common/stylus/mixins.styl'

  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      color rgba(255,255,255,0.4)
      font-size 0
      .content-left
        flex 1
        .logo-wrapper
          position relative
          top -10px
          margin 0 12px
          display inline-block
          width 56px
          height 56px
          box-sizing border-box
          padding 6px
          border-radius 50%
          background #141d27
          .logo
            background #2b343c
            border-radius 50%
            width 100%
            height 100%
            text-align center
            &.highlight
              background rgb(0,160,220)
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              &.highlight
                color rgb(255,255,255)
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            font-size 9px
            font-weight 700
            color rgb(255,255,255)
            background rgb(240,20,20)
            border-radius 8px
            text-align center
        .price
          font-size 16px
          line-height 24px
          height 24px
          font-weight 700
          padding-right 12px
          display inline-block
          margin 12px 0
          border-right 1px solid rgba(255,255,255,0.1)
          vertical-align top
        .desc
          display inline-block
          font-size 10px
          line-height 48px
          padding-left 12px
          vertical-align top
      .content-right
        flex 0 0 105px
        .pay
          height 48px
          width 105px
          text-align center
          font-size 12px
          font-weight 700
          line-height 48px
          background #2b333b
          &.enough
            background #00b43c
            color #fff

    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          background rgb(0,160,220)
          border-radius 50%
          transition all 0.4s linear

    .shopcart-list
      position absolute 
      left 0
      top 0
      width 100%
      z-index -1
      transform translate3d(0, -100%, 0)  /*显示时的状态*/
      &.fold-enter, &.fold-leave-to
        transform translate3d(0, 0, 0)
      &.fold-enter-active, &.fold-leave-active
        transition all 0.5s
      .list-header
        display flex
        height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        line-height 40px
        font-size 0
        .title
          flex 1
          display inline-block
          font-weight 200
          font-size 14px
          color rgb(1,17,17)
          vertical-align top
        .empty
          flex 0 0 auto 
          display inline-block
          font-size 12px
          color rgb(0,160,220)
          vertical-align top
      .list-content
        max-height 217px
        over-flow hidden
        padding 0 18px
        background #fff
        .food
          display flex
          border-1px(rgba(7,17,27,0.1))
          padding 12px 0
          .name
            flex 1
            font-size 14px
            line-height 24px
            color rgb(7,17,27)
          .price
            flex 0 0 auto
            margin-right 12px
            line-height 24px
            font-size 14px
            color rgb(240,20,20)
            font-weight 700
          .cartcontrol-wrapper
            flex 0 0 auto

  .list-mask
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    z-index 40
    background rgba(7,17,27,0.6)
    backdrop-filter blur(10px)  /*不能识别*/
    &.fade-enter, &.fade-leave-to
      background rgba(7,17,27,0)
    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s



</style>
