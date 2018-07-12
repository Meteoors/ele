<template>
  <div class='star' :class='"star-"+size'>
      <span class='star-item' v-for='(item, index) in starArr' :class='item' :key='index'></span>
  </div>
</template>

<script>
  const LENGTH = 5
  const CLASS_ON = 'on'
  const CLASS_HALF = 'half'
  const CLASS_OFF = 'off'
  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },

    computed: {
      starArr () {
        const arr = []
        const score = this.score
        const integer = Math.floor(score)
        for(let i=0; i<integer; i++){
          arr.push(CLASS_ON)
        }
        if(score-integer >= 0.5){
          arr.push(CLASS_HALF)
        }
        while(arr.length < LENGTH){
        	arr.push(CLASS_OFF)
        }
        return arr
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/stylus/mixins.styl"

  .star
		.star-item
			display inline-block
			background-repeat no-repeat
		&.star-48
			.star-item
				height 20px
				width 20px
				background-size 20px 20px
				margin-right 22px
				&:last-child
					margin-right 0
			.on
				bg-image('star48_on')
			.half
				bg-image('star48_half')
			.off
				bg-image('star48_off')
		&.star-36
			.star-item
				height 15px
				width 15px
				background-size 15px 15px
				margin-right 6px
				&:last-child
					margin-right 0
			.on
				bg-image('star36_on')
			.half
				bg-image('star36_half')
			.off
				bg-image('star36_off')
		&.star-24
			.star-item
				height 10px
				width 10px
				background-size 10px 10px
				margin-right 6px
				&:last-child
					margin-right 0
			.on
				bg-image('star24_on')
			.half
				bg-image('star24_half')
			.off
				bg-image('star24_off')
	
</style>
