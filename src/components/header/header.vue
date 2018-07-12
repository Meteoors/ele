<template>
  <div class='header'>
		<div class='content-wrapper'>
			<div class='avatar'>
				<img :src="seller.avatar">
			</div>
			<div class='content'>
				<div class='title'>
					<span class='brand'></span>
					<span class='name'>{{seller.name}}</span>
				</div>
				<div class='description'>
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<div class='support' v-if='seller.supports'>
					<span class='icon' :class='classMap[seller.supports[0].type]'></span>
					<span class='text'>{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div class='supports_count' v-if='seller.supports' @click='showDetail(true)'>
				<span class='count'>{{seller.supports.length}}个</span>
				<span class='icon-keyboard_arrow_right'></span>
			</div>
		</div>
		<div class='bulletin-wrapper' @click='showDetail(true)'>
			<span class='bulletin-title'></span>
			<span class='bulletin-text'>{{seller.bulletin}}</span>
			<i class='icon-keyboard_arrow_right'></i>
		</div>
		<div class='background'>
			<img :src="seller.avatar" width='100%' height='100%'>
		</div>
		<transition name='fade'>
			<div class='detail' v-show='detailShow'>
				<div class='detail-wrapper'>
					<div class='detail-main'>
						<div class='name'>{{seller.name}}</div>
						<div class='star-wrapper'>
							<star :score='seller.score' :size='48'></star>
						</div>
						<div class='title'>
							<div class='line'></div>
							<div class='text'>优惠信息</div>
							<div class='line'></div>
						</div>
						<ul class='supports'>
							<li class='support' v-for='support in seller.supports'>
								<span class='icon' :class='classMap[support.type]'></span>
								<span class='text'>{{support.description}}</span>
							</li>
						</ul>
						<div class='title'>
							<div class='line'></div>
							<div class='text'>商家公告</div>
							<div class='line'></div>
						</div>
						<div class='content'>
							<p>{{seller.bulletin}}</p>
						</div>
					</div>
				</div>
				<div class='detail-close' @click='showDetail(false)'>
					<span class='icon-close'></span>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import star from '../star/star'

  export default {
		components: {
			star
		},

		props: {
			seller: {
				type: Object
			}
		},

		created () {
			this.classMap = ["decrease","discount","special","invoice","guarantee"]
		},

		data () {
			return {
				detailShow: false
			}
		},

		methods: {
			showDetail(isShow){
				this.detailShow = isShow
			}
		}
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
	@import '../../common/stylus/mixins.styl'

	.header
		background-color rgba(7,17,27,0.5)
		position relative
		overflow hidden
		color rgb(255,255,255)
		.content-wrapper
			padding 24px 12px 18px 24px
			position relative
			font-size 0
			.avatar
				display inline-block
				vertical-align top
				width 64px
				height 64px
				img
					width 100%
			.content
				display inline-block
				margin-left 16px
				vertical-align top
				.title
					margin 2px 0 8px 0
					.brand
						display inline-block
						bg-image(brand)
						margin-right 6px
						vertical-align top
						background-size 30px 18px
						height 18px
						width 30px 
						background-repeat	no-repeat
					.name
						display inline-block
						font-size 16px
						font-weight bold
						line-height 18px
						height 18px
						vertical-align top
				.description
					font-size 12px
					font-weight 200
					line-height 12px
				.support
					margin 10px 0 2px 0
					.icon
						width 12px
						height 12px
						margin-right 4px
						display inline-block
						background-size 12px 12px
						background-repeat no-repeat
						vertical-align top
					.decrease
						bg-image(decrease_1)
					.discount
						bg-image(discount_1)
					.special
						bg-image(special_1)
					.invoice
						bg-image(invoice_1)
					.guarantee
						bg-image(guarantee_1)

					.text
						font-size 10px
						font-weight 200
						line-height 12px
						vertical-align top

			.supports_count
				position absolute 
				right 12px
				bottom 15px
				padding 0 8px
				border-radius 12px
				background-color rgba(0,0,0,0.2)
				height 24px
				box-sizing border-box
				.count
					font-size 10px
					font-weight 200
					line-height 24px
					display inline-block
					height 24px
				.icon-keyboard_arrow_right
					font-size 10px
					font-weight 200
					line-height 24px
					display inline-block
					height 24px
					vertical-align top
		.bulletin-wrapper
			padding 0 20px 0 12px
			background-color rgba(7,17,27,0.2)
			position relative
			overflow hidden
			text-overflow ellipsis
			white-space nowrap
			.bulletin-title
				bg-image(bulletin)
				width 22px
				height 12px
				background-repeat no-repeat
				background-size 100% 100%
				margin-right 4px
				display inline-block
				vertical-align middle
			.bulletin-text
				font-size 10px
				font-weight 200
				line-height 28px
			.icon-keyboard_arrow_right
				position absolute 
				right 12px
				bottom 9px
				font-size 10px
		.background
			position absolute
			left 0
			top 0
			width 100%
			height 100%
			z-index -1
			img
				filter blur(10px)
			
		.detail
			position fixed
			left 0
			top 0
			bottom 0
			right 0
			background rgba(7,17,27,0.8)
			z-index 100
			backdrop-filter blur(10px)
			&.fade-enter-active, &.fade-leave-active
				transition: opacity .3s linear
			&.fade-enter, &.fade-leave-to
				opacity 0
			.detail-wrapper
				padding 64px 0
				.detail-main
					color rgb(255,255,255)
					.name
						height 16px
						font-size 16px
						font-weight 700
						line-height 16px
						text-align center
						margin-bottom 16px
					.star-wrapper
						height 24px
						margin-bottom 28px
						box-sizing border-box
						padding 2px 0
						text-align center

					.title
						padding 0 36px
						height 14px
						margin-bottom 24px
						display flex
						.line
							position relative
							top 6px
							width 112px
							height 2px
							background-color rgba(255,255,255,0.2)
							flex 1
						.text
							font-size 14px
							margin 0 12px
					.supports
						overflow hidden
						padding 0 48px
						margin-bottom 16px
						.support
							margin-bottom 12px
							height 16px
							.icon
								width 16px
								height 16px
								background-size 16px 16px
								background-repeat no-repeat
								display inline-block
								vertical-align top
							.decrease
								bg-image(decrease_2)
							.discount
								bg-image(discount_2)
							.special
								bg-image(special_2)
							.invoice
								bg-image(invoice_2)
							.guarantee
								bg-image(guarantee_2)
							.text
								font-size 12px
								line-height 16px
								font-weight 200
								display inline-block
								height 16px
								vertical-align top
								margin-left 1px
					.content
						padding 0 48px
						font-size 12px
						font-weight 200
						line-height 24px
			
			.detail-close
				position absolute
				width 100%
				text-align center
				color rgba(255,255,255,0.5)
				height 32px
				font-size 32px
				line-height 32px
				bottom 32px

</style>
