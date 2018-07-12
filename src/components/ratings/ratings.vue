<template>
  <div class='ratings' ref='ratings'>
		<div>
	    <div class='desc'>

	      <div class='left'>
	        <div class='score'>{{seller.score}}</div>
	        <div class='title'>综合评分</div>
	        <div class='rank'>高于周边商家{{seller.rankRate}}%</div>
	      </div>

	      <div class='right'>
	        <div class='score-wrapper'>
	          <span class='title'>服务态度</span>
	          <star :score='seller.serviceScore' :size='36'></star>
	          <span class='score'>{{seller.serviceScore}}</span>
	        </div>
	        <div class='score-wrapper'>
	          <span class='title'>商品评分</span>
	          <star :score='seller.foodScore' :size='36'></star>
	          <span class='score'>{{seller.foodScore}}</span>
	        </div>
	        <div class='delivery-wrapper'>
	          <span class='title'>送达时间</span>
	          <span class='time'>{{seller.deliveryTime}}分钟</span>
	        </div>
	      </div>

	    </div>

			<split></split>

			<ratingselect	:desc='desc'
										:ratings='ratings'
										:contentOnly='contentOnly'
										:selectType='selectType'
										@switchContentOnly='switchContentOnly'
										@setSelectType='setSelectType'
			></ratingselect>

			<div class='rating-wrapper'>
				<ul>
					<li class='rating' v-for='rating in filterRatings'>
						<div class='avatar'>
							<img :src="rating.avatar">
						</div>
						<div class='content'>
							<div class='name'>{{rating.username}}</div>
							<div class='star-wrapper'>
								<star :score='rating.score' :size='24'></star>
								<span class='delivery'>{{rating.deliveryTime}}分钟送达</span>
							</div>
							<div class='text'>{{rating.text}}</div>
							<div class='recommend'>
								<span :class='rating.rateType === 0 ? "icon-thumb_up" : "icon-thumb_down"'></span>
								<span class='item' v-for='item in rating.recommend'>{{item}}</span>
							</div>
							<div class='time'>{{getTime(rating.rateTime)}}</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
  </div>
</template>

<script>
	import BScroll from 'better-scroll'
	import axios from 'axios'

	import star from '../star/star.vue'
	import split from '../split/split.vue'
	import ratingselect from '../ratingselect/ratingselect.vue'

	Date.prototype.toLocaleString = function(){
		return `${this.getFullYear()}-${this.getMonth()+1}-${this.getDate()} ${this.getHours()}:${this.getMinutes()}`
	}

  export default {
		props: ['seller'],

		data () {
			return {
				ratings: [],
				desc: {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				},
				contentOnly: true,
				selectType: 2
			}
		},

		created () {
			axios.get('/api2/ratings').then((response) => {
				if(response.data.code === 0){
					this.ratings = response.data.data
				}
				console.log(this.ratings)
			})

			this.$nextTick(() => {
				this._initScroll()
			})
		},

		methods: {
			_initScroll () {
				this.scroll = new BScroll(this.$refs.ratings, {
					click: true
				})
			},

			switchContentOnly () {
				this.contentOnly = !this.contentOnly

				this.$nextTick(() => {
					this.scroll.refresh()
				})
			},

			setSelectType (type) {
				this.selectType = type

				this.$nextTick(() => {
					this.scroll.refresh()
				})
			},

			getTime (seconds) {
				return new Date(seconds).toLocaleString()
			}
		},

		computed: {
			filterRatings () {
				var {ratings, contentOnly, selectType} = this
				var arr

				if(selectType === 2){
					arr = ratings
				}else if(selectType === 0){
					arr = ratings.filter((rating) => {
						return rating.rateType === 0
					})
				}else if(selectType === 1){
					arr = ratings.filter((rating) => {
						return rating.rateType === 1
					})
				}

				if(contentOnly){
					arr = arr.filter((rating) => {
						return rating.text
					})
				}

				return arr
			}
		},

		components: {
			star,
			split,
			ratingselect
		}
	}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
	@import '../../common/stylus/mixins.styl'

	.ratings
		position absolute
		top 174px
		bottom 0
		left 0
		width 100%
		overflow hidden
		.desc
			display flex
			padding 18px 0
			.left
				width 137px
				flex 0 0 137px
				border-right 1px solid rgba(7,17,27,0.1)
				.score
					font-size 24px
					line-height 28px
					text-align center
					color rgb(255,153,0)
					margin-bottom 6px
				.title
					text-align center
					font-size 12px
					color rgb(7,17,27)
					line-height 12px
					margin-bottom 8px
				.rank
					text-align center
					font-size 10px
					line-height 10px
					margin-bottom 6px
					color rgb(147,153,159)
			.right
				flex 1
				padding 0 24px
				.score-wrapper
					margin-bottom 8px
					font-size 0
					.title
						display inline-block
						font-size 12px
						color rgb(7,17,27)
						line-height 18px
						vertical-align top
					.star
						display inline-block
						margin 0 12px
						vertical-align top
					.score
						display inline-block
						font-size 12px
						line-height 18px
						color rgb(255,153,0)
						vertical-align top
				.delivery-wrapper
					font-size 0
					.title
						display inline-block
						font-size 12px
						line-height 18px
						color rgb(7,17,27)
						vertical-align top
					.time
						display inline-block
						font-size 12px
						line-height 18px
						color rgb(147,153,159)
						vertical-align top
						margin-left 12px

		.rating-wrapper
			padding 0 18px
			.rating
				padding 18px 0
				display flex
				border-1px(rgba(7,17,27,0.1))
				.avatar
					flex 0 0 28px
					margin-right 12px
					img
						width 28px
						height 28px
						border-radius 14px
				.content
					flex 1
					position relative
					.name
						font-size 10px 
						color rgb(7,17,27)
						line-height 12px
						margin-bottom 4px
					.star-wrapper
						margin-bottom 6px
						font-size 0
						.star
							display inline-block
							vertical-align top
						.delivery
							display inline-block
							margin-left 6px
							font-size 10px
							line-height 12px
							vertical-align top
							color rgb(147,153,159)
							font-weight 200
					.text
						font-size 12px
						line-height 18px
						color rgb(7,17,27)
						margin-bottom 8px
					.recommend
						font-size 0
						.icon-thumb_down, .icon-thumb_up
							display inline-block
							vertical-align top
							font-size 12px
							line-height 18px
							vertical-align top
						.icon-thumb_up
							color rgb(0,160,220)
						.icon-thumb_down
							color rgb(183,187,191)
						.item
							display inline-block
							vertical-align top
							margin-left 8px
							font-size 9px
							line-height 16px
							border 1px solid rgba(7,17,27,0.1)
							border-radius 1px
							padding 0 6px
							color rgb(147,153,159)
							max-width 58px
							white-space nowrap
							text-overflow ellipsis
							overflow hidden
					.time
						position absolute 
						font-size 10px
						line-height 12px
						font-weight 200
						color rgb(147,153,159)
						top 0
						right 0

</style>
