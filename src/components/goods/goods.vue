<template>
  <div>
		<div class='goods'>
      <div class='menu-wrapper' ref='menuWrapper'>
        <ul>
          <li class='menu-item' v-for='(good, index) in goods' 
              :class='{current: index===currentIndex}' @click='clickMenuItem(index, $event)'>
            <span class='text border-1px'>
              <span class='icon' v-if='good.type>=0' :class='classMap[good.type]'></span>{{good.name}}
            </span>
          </li>
        </ul>
      </div>

      <div class='foods-wrapper' ref='foodsWrapper'>
        <ul>
          <li class='food-list' v-for='good in goods'>
            <h1 class='title'>{{good.name}}</h1>
            <ul>
              <li class='food-item border-1px' v-for='food in good.foods' @click='clickFood(food, $event)'>
                <div class='icon'>
                  <img :src="food.icon">
                </div>
                <div class='content'>
                  <h2 class='name'>{{food.name}}</h2>
                  <p class='desc' v-show='food.description'>{{food.description}}</p>
                  <div class='extra'>
                    <span class='count'>月售{{food.sellCount}}份</span>
                    <span class='rating'>好评率{{food.rating}}%</span>
                  </div>
                  <div class='price'>
                    <span class='now'>￥{{food.price}}</span>
                    <span class='old' v-show='food.oldPrice'>￥{{food.oldPrice}}</span>
                  </div>
                  <div class='cartcontrol-wrapper'>
                    <cartcontrol :food='food' :update-food-count='updateFoodCount'></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart :food-list='foodList'
                :clear-cart='clearCart'
                :update-food-count='updateFoodCount'
                :min-price='seller.minPrice'
                :delivery-price='seller.deliveryPrice'
                ref='shopcart'></shopcart>
    </div>
    
    <food :food='selectFood' :updateFoodCount='updateFoodCount' ref='food'></food>
	</div>
</template>

<script>
  import axios from 'axios'
  import Vue from 'vue'
  import BScroll from 'better-scroll'

  import shopcart from '../shopcart/shopcart.vue'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import food from '../food/food.vue'

  export default {
    props: ['seller'],

    data () {
      return {
        goods: [],
        selectFood: {},
        scrollY: 0,
        tops: []
      }
    },

    created () {
      this.classMap=['decrease', 'discount', 'special', 'invoice', 'guarantee']
      axios.get('/api2/goods').then((response) => {
        const result = response.data
        if(result.code===0){
          this.goods = result.data
        }
        console.log(this.goods)

        Vue.nextTick(() => {
          this._initScroll()
          this._initTops()
        })
      })
    },

    methods:{
      _initScroll () {
        new BScroll(this.$refs.menuWrapper, {
          click: true
        })

        this.foodScroll=new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        })

        //绑定Scroll监听
        this.foodScroll.on('scroll', (pos) => {
          //console.log(pos.y)
          this.scrollY = Math.abs(pos.y)
        }) 
      },

      _initTops () {
        var tops = this.tops
        var top = 0
        tops.push(top)
        var lis = this.$refs.foodsWrapper.getElementsByClassName('food-list')
        ;[].slice.call(lis).forEach( li => {
          top += li.clientHeight
          tops.push(top)
        })
      },

      clickMenuItem (index, event) {
        //过滤原生事件      //_constructed属性是better-scroll库加上的
        if(!event._constructed){   
          return
        }
        //将右侧列表滚动到对应的位置
        var li = this.$refs.foodsWrapper.getElementsByClassName('food-list')[index]
        this.foodScroll.scrollToElement(li, 300)
      },

      clickFood (food, event) {
        if(!event._constructed) {
          return
        }
        // 更新food
        this.selectFood = food
        //显示food组件
        this.$refs.food.show(true)

      },

      updateFoodCount (food, isAdd, event){
        if(!event._constructed){
          return
        }

        if(isAdd){
          if(!food.count){
            //新增count属性
            //用food.count=1赋值没有监视-->没有数据绑定，界面不会更新
            Vue.set(food, 'count', 1)  //只适用于嵌套对象(food属于goods)，对根级别的响应式属性(goods)无效
          }else{
            food.count++
          }
          //通知购物车启动一个小球的动画
          this.$refs.shopcart.drop(event.target)
        }else{
          if(food.count){
            food.count--
          }
        }
      },

      clearCart () {
        this.foodList.forEach(food => {
          food.count = 0
        })
      }

    },

    computed: {
      foodList () {
        const foods = []
        this.goods.forEach(good => {
          good.foods.forEach(food => {
            if(food.count){
              foods.push(food)
            }
          })
        })
        return foods
      },

      currentIndex () {
        const {tops, scrollY} = this

        return tops.findIndex((top, index) => {
          return scrollY>=top && scrollY<tops[index+1]
        })
      }
    },

    components: {
      cartcontrol,
      shopcart,
      food
    }

  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '../../common/stylus/mixins.styl'

  .goods
    display flex
    position absolute 
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        padding 0 12px
        line-height 14px
        &.current
          background #fff
          margin-top -1px
          position relative
          .text
            border-none()
        .text
          border-1px(rgba(7,17,27,0.1))
          display table-cell
          width 56px
          vertical-align middle    
          font-size 12px
        .icon
          display inline-block
          background-size 12px 12px
          height 12px
          width 12px
          background-repeat no-repeat
          vertical-align top
          margin-right 2px
          &.decrease
            bg-image('decrease_3')  
          &.discount
            bg-image('discount_3')
          &.special
            bg-image('special_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
    .foods-wrapper
      flex 1
      .title
        border-left 2px solid #d9dde1
        padding-left 12px
        font-size 12px
        line-height 26px
        background #f3f5f7
        color rgb(147,153,159)
      .food-item
        margin 0 18px
        padding 18px 0
        border-1px(rgba(7,17,27,0.1))
        display flex
        &:last-child
          border-none()
        .icon
          flex 0 0 57px
          margin-right 10px
          img
            width 57px
            height 57px
        .content
          flex 1
          .name
            font-size 14px
            line-height 14px
            color rgb(7,17,27)
            margin-top 2px
          .desc
            margin-top 8px
            font-size 10px 
            line-height 10px
            color rgb(147,153,159)
          .extra
            margin-top 8px
            font-size 10px
            line-height 10px
            color rgb(147,153,159)
            .count
              margin-right 10px
          .price
            line-height 24px
            font-weight 700
            .now
              font-size 14px
              color rgb(240,20,20)
              margin-right 6px
            .old
              font-size 10px
              color rgb(147,153,159)
              text-decoration line-through
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 18px
      

</style>
