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

const COMPONENT_NAME = 'slide'

//   export default {
// 	name: COMPONENT_NAME,
// 	components:{
// 		Scroll
// 	},
// 	data() {
// 		return {
// 			tabArr:['河南台','网络台','市县台'],
// 			currentPageIndex:0
// 		}
// 	},
//     props: {
//       loop: {
//         type: Boolean,
//         default: true
//       },
//       autoPlay: {
//         type: Boolean,
//         default: true
//       },
//       interval: {
//         type: Number,
//         default: 4000
//       },
//       showDot: {
//         type: Boolean,
//         default: true
//       },
//       click: {
//         type: Boolean,
//         default: true
//       },
//       threshold: {
//         type: Number,
//         default: 0.3
//       },
//       speed: {
//         type: Number,
//         default: 400
//       }
//     },
//     data() {
//       return {
//         dots: [],
//         currentPageIndex: 0
//       }
//     },
//     mounted() {
//       this.update()

//       window.addEventListener('resize', () => {
//         if (!this.slide || !this.slide.enabled) {
//           return
//         }
//         clearTimeout(this.resizeTimer)
//         this.resizeTimer = setTimeout(() => {
//           if (this.slide.isInTransition) {
//             this._onScrollEnd()
//           } else {
//             if (this.autoPlay) {
//               this._play()
//             }
//           }
//           this.refresh()
//         }, 60)
//       })
//     },
//     activated() {
//       if (!this.slide) {
//         return
//       }
//       this.slide.enable()
//       let pageIndex = this.slide.getCurrentPage().pageX
//       this.slide.goToPage(pageIndex, 0, 0)
//       this.currentPageIndex = pageIndex
//       if (this.autoPlay) {
//         this._play()
//       }
//     },
//     deactivated() {
//       this.slide.disable()
//       clearTimeout(this.timer)
//     },
//     beforeDestroy() {
//       this.slide.disable()
//       clearTimeout(this.timer)
//     },
//     methods: {
//       update() {
//         if (this.slide) {
//           this.slide.destroy()
//         }
//         this.$nextTick(() => {
//           this.init()
//         })
//       },
//       refresh() {
//         this._setSlideWidth(true)
//         this.slide.refresh()
//       },
//       prev() {
//         this.slide.prev()
//       },
//       next() {
//         this.slide.next()
//       },
//       init() {
//         clearTimeout(this.timer)
//         this.currentPageIndex = 0
//         this._setSlideWidth()
//         if (this.showDot) {
//           this._initDots()
//         }
//         this._initSlide()

//         if (this.autoPlay) {
//           this._play()
//         }
//       },
//       _setSlideWidth(isResize) {
//         this.children = this.$refs.slideGroup.children

//         let width = 0
//         let slideWidth = this.$refs.slide.clientWidth
//         for (let i = 0; i < this.children.length; i++) {
//           let child = this.children[i]
//           addClass(child, 'slide-item')

//           child.style.width = slideWidth + 'px'
//           width += slideWidth
//         }
//         if (this.loop && !isResize) {
//           width += 2 * slideWidth
//         }
//         this.$refs.slideGroup.style.width = width + 'px'
//       },
//       _initSlide() {
//         console.log(this.threshold)
//         this.slide = new BScroll(this.$refs.slide, {
//           scrollX: true,
//           scrollY: false,
//           momentum: false,
//           snap: {
//             loop: this.loop,
//             threshold: this.threshold,
//             speed: this.speed
//           },
//           bounce: false,
//           click: this.click
//         })

//         this.slide.on('scrollEnd', this._onScrollEnd)

//         this.slide.on('touchEnd', () => {
//           if (this.autoPlay) {
//             this._play()
//           }
//         })

//         this.slide.on('beforeScrollStart', () => {
//           if (this.autoPlay) {
//             clearTimeout(this.timer)
//           }
//         })
//       },
//       _onScrollEnd() {
//         let pageIndex = this.slide.getCurrentPage().pageX
//         this.currentPageIndex = pageIndex
//         if (this.autoPlay) {
//           this._play()
//         }
//       },
//       _initDots() {
//         this.dots = new Array(this.children.length)
//       },
//       _play() {
//         clearTimeout(this.timer)
//         this.timer = setTimeout(() => {
//           this.slide.next()
//         }, this.interval)
//       }
//     },
//     watch: {
//       loop() {
//         this.update()
//       },
//       autoPlay() {
//         this.update()
//       },
//       speed() {
//         this.update()
//       },
//       threshold() {
//         this.update()
//       }
//     }
//   }

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
