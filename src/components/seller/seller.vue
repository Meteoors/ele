<template>
  <div class='seller' ref='seller'>
		<div>

			<div class='overview'>
				<div class='name'>{{seller.name}}</div>
				<div class='desc border-1px'>
					<star :score='seller.score' :size='36'></star>
					<span class='text'>({{seller.ratingCount}})</span>
					<span class='text'>月售{{seller.sellCount}}单</span>
				</div>
				<ul class='remark'>
					<li class='block'>
						<h2>起送价</h2>
						<div class='text'>
							<span class='stress'>{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class='block'>
						<h2>商家配送</h2>
						<div class='text'>
							<span class='stress'>{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class='block'>
						<h2>平均配送时间</h2>
						<div class='text'>
							<span class='stress'>{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<div class='favorite' @click='toggle($event)'>
					<div class='icon-favorite' :class='{active: favorite}'></div>
					<div class='text'>{{favorite ? '已收藏' : '收藏'}}</div>
				</div>
			</div>

			<split></split>

			<div class='bulletin'>
				<h1 class='title'>公告与活动</h1>
				<p class='content border-1px'>
					{{seller.bulletin}}
				</p>
				<ul class='supports'>
					<li v-for='support in seller.supports' class='support-item border-1px'>
						<span class='icon' :class='classMap[support.type]'></span>
						<span class='text'>{{support.description}}</span>
					</li>
				</ul>
			</div>

			<split></split>

			<div class='pics'>
				<h1 class='title'>商家实景</h1>
				<div class='pic-wrapper' ref='picWrapper'>
					<ul class='pic-list'>
						<li class='pic-item' v-for='pic in seller.pics'>
							<img :src="pic" width='120' height='90'>
						</li>
					</ul>
				</div>	
			</div>

			<split></split>

			<div class='info border-1px'>
				<h1 class='title'>商家信息</h1>
				<ul>
					<li v-for='info in seller.infos' class='info-item'>{{info}}</li>
				</ul>
			</div>

		</div>
	</div>
</template>

<script>
	import split from '../split/split.vue'
	import star from '../star/star.vue'
	import BScroll from 'better-scroll'

  export default {
		props: ['seller'],

		data () {
			return {
				favorite: false,
				classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
			}
		},

		created () {
			this.$nextTick(() => {
				new BScroll(this.$refs.seller, {
					click: true
				})
	
				const liWidth = 120
				const space = 6

				const ul = this.$refs.picWrapper.children[0]
				const count = ul.children.length
				ul.style.width = (liWidth + space) * count - space + 'px'

				new BScroll(this.$refs.picWrapper, {
					click: true,
					scrollX : true
				})

			})
		},

		methods: {
			toggle (event) {
				if(!event._constructed){
					return
				}

				this.favorite = !this.favorite
			}
		},

		components: {
			star,
			split
		}
	}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
	@import '../../common/stylus/mixins.styl'

	.seller
		position absolute 
		top 174px
		bottom 0
		width 100%
		overflow hidden

		.overview
			position relative
			padding 18px
			.name
				font-size 14px
				color rgb(7,17,27)
				line-height 14px
				margin-bottom 8px
			.desc
				padding-bottom 18px
				margin-bottom 18px
				border-1px(rgba(7,17,27,0.1))
				font-size 0
				height 18px
				.star
					display inline-block
					vertical-align top
					margin-top 1px
					margin-right 8px
				.text
					display inline-block
					vertical-align top
					font-size 10px
					line-height 18px
					color rgb(77,85,93)
					margin-right 12px
			.remark
				display flex
				.block
					flex 1
					text-align center
					border-right 1px solid rgba(7,17,27,0.1)
					&:last-child
						border-right none
					h2
						font-size 10px
						color rgb(147,153,159)
						line-height 10px
						margin-bottom 4px
					.text
						font-size 10px
						color rgb(7,17,27)
						.stress
							font-size 24px
							font-weight 200
							line-height 24px
			.favorite
				position absolute 
				right 11px
				top 19px
				width 50px
				text-align center
				.icon-favorite
					font-size 24px
					line-height 24px
					color #d4d6d9
					margin-bottom 4px
					&.active
						color rgb(240,20,20)
				.text
					font-size 10px
					line-height 10px
					color rgb(77,85,93)
				
		.bulletin
			padding 18px 18px 0 18px
			.title
				font-size 14px
				line-height 14px
				color rgb(7,17,27)
				margin-bottom 8px
			.content
				border-1px(rgba(7,17,27,0.1))
				padding 0 12px 16px
				font-size 12px
				line-height 24px
				color rgb(240,20,20)
				font-weight 200
			.supports
				.support-item
					border-1px(rgba(7,17,27,0.1))
					padding 16px 12px
					font-size 0
					&:last-child
						border-none()
					.icon
						display inline-block
						width 16px
						height 16px
						vertical-align top 
						background-size 16px 16px
						background-repeat no-repeat
						margin-right 6px
						&.decrease
							bg-image('decrease_4')
						&.special
							bg-image('special_4')
						&.discount
							bg-image('discount_4')
						&.invoice
							bg-image('invoice_4')
						&.guarantee
							bg-image('guarantee_4')
					.text
						display inline-block
						vertical-align top
						font-size 12px
						line-height 16px
						color rgb(7,17,27)
						font-weight 200

		.pics
			padding 18px
			.title
				font-size 14px
				line-height 14px
				color rgb(7,17,27)
				margin-bottom 12px
			.pic-wrapper
				width 100%
				height 90px
				overflow hidden
				.pic-list	
					white-space nowrap
					font-size 0
					.pic-item
						display inline-block
						margin-right 6px
						width 120px
						height 90px
					&:last-child
						margin-right 0
		
		.info
			color rgb(7, 17, 27)
			padding 18px 18px 0
			.title
				font-size 14px
				height 14px
				padding-bottom 12px
				border-1px(rgba(7,17,27,0.1))
			.info-item
				font-size 12px
				line-height 16px
				font-weight 200
				border-1px(rgba(7,17,27,0.1))
				padding 16px 12px
				&:last-child
					border-none()




</style>
