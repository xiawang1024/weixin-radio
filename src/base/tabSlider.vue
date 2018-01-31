<template>
	<div class="slider" ref="slider" >
		<div class="slider-group" ref="sliderGroup">
			<slot>
			</slot>
		</div>
		<div class="tab">
			<div class="item" v-for="(item,index) in tabArr">
				<span
					:class="currentPageIndex == index ? 'isCurrent' : '' "
					@click="goToPage(index)"
				>{{item}}</span>
			</div>
		</div>
	</div>
</template>

<script>
// import Scroll from '@/base/scroll'
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
	props:{
		data:{
			type:Array,
			default:[]
		}
	},
	data() {
		return {
			tabArr:['河南台','网络台','市县台'],
			currentPageIndex:0
		}
	},
	mounted() {
		setTimeout(() => {
			this._setSliderWidth()
			this._initSlider()
		},20)
		window.addEventListener('resize', () => {
	        if (!this.slider) {
	          return
	        }
	        this._setSliderWidth()
	        this.slider.refresh()
	    })
	},
	created(){
		this.slider = null;
	},
	methods:{
		_initSlider() {
			this.slider = new BScroll(this.$refs.slider,{
				scrollX:true,
				scrollY:true,
				momentum:false,
				snap:true,
				snapThreshold:0.3,
				click:true
			})
			this.slider.on('scrollEnd',() => {
				let pageIndex = this.slider.getCurrentPage().pageX;
				this.currentPageIndex = pageIndex;
			})
		},
		_setSliderWidth() {
			this.children = this.$refs.sliderGroup.children;
			let width = 0;
			let sliderWidth = this.$refs.slider.clientWidth;
			for(let i=0;i<this.children.length;i++){
				let child = this.children[i];
				addClass(child, 'slider-item')
				child.style.width = sliderWidth + 'px';
				width += sliderWidth
			}

			this.$refs.sliderGroup.style.width = width +'px';
		},
		_refresh(){
			this.slider.refresh()
		},
		_slideTo(index) {
			// this.slider.
		},
		goToPage(index){
			console.log(index)
			this.slider.goToPage(index, 0, 800);
			this.currentPageIndex = index;
		},
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin.styl'
.tab
	top 0
	width 100%
	height $channel-tab-height
	display flex
	align-items center
	justify-content center
	background #fff
	border-1px(#bebebe)
	position: absolute
	z-index 20
	.item
		flex 1
		text-align center
		font-size 32px
		span
			extend-click()
		.isCurrent
			padding 10px 20px
			border-radius 50px
			background orange
			color #fff
.slider
	min-height 1px
	.slider-group
		position: relative
		padding-top $channel-tab-height
		height 100%
		overflow hidden
		white-space nowrap
		box-sizing border-box
		.slider-item
			height 100%
			float: left
			position: relative
			display inline-block
	        box-sizing: border-box
	        overflow: hidden
	        text-align: center
</style>
