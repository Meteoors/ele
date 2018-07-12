<template>
  <div class='cartcontrol'>
    <transition name='move'>
      <div class='cart-decrease icon-remove_circle_outline' v-show='food.count' @click.stop='updateFoodCount(food, false, $event)'></div>
    </transition>
    <div class='cart-count' v-show='food.count'>{{food.count}}</div>
    <div class='cart-add icon-add_circle' @click.stop='updateFoodCount(food, true, $event)'></div>
  </div>
</template>

<script>
  export default {
    props: {
      food: Object,
      updateFoodCount: Function
    },

    methods: {
      foo () {
        console.log("clicked!")
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .cartcontrol
    line-height 24px
    height 24px
    .cart-decrease
      display inline-block
      font-size 24px
      color rgb(0,160,220)
      &.move-enter-active, &.move-leave-active
        transition all .4s linear
      &.move-enter, &.move-leave-active
        opacity 0
        transform translate3d(24px, 0 ,0) rotate(180deg)
    .cart-count
      line-height 24px
      display inline-block
      font-size 10px
      color rgb(147,153,159)
      vertical-align top
      padding 0 6px
      width 12px
    .cart-add
      display inline-block
      font-size 24px
      color rgb(0,160,220)

</style>
