<template>
	<div class="slider" ref="slider" >
		<div class="slider-group" ref="sliderGroup">
			<div
				class="date"
				v-for="(item, index) in dateArray"
				@click="getDatePrograms(index, item)"
			>
				<span class="week">{{item.week}}</span>
				<span class="day">{{item.date}}</span>
				<span class="dot" v-show="currentDateIndex == index"></span>
			</div>
		</div>
	</div>
</template>

<script>
import Scroll from '@/base/scroll'
import BScroll from 'better-scroll'
export default {
	name:'slider',
	data() {
		return {
			currentDateIndex:0
		}
	},
	mounted() {
		setTimeout(() => {
			this._setDateWrapWidth()
			this._initSlider()
			setTimeout(() => {
				this.scrollTo()
			},20)
		},500)
		window.addEventListener('resize', () => {
	        if (!this.slider) {
	          return
	        }
	        setTimeout(() => {
				this._setDateWrapWidth()
				this.slider.refresh()
				setTimeout(() => {
					this.scrollTo()
				},20)
			},500)
	    })
	},
	computed:{
		dateArray() {
			let dateArr = this._getDateArray(30)
			this.currentDateIndex = dateArr.length - 1;
			return dateArr
		}
	},
	watch:{
		dateArray() {
			setTimeout(() => {
				this.slider.refresh()
			},20)
		}
	},
	methods:{
		_initSlider() {
			this.slider = new BScroll(this.$refs.slider,{
				scrollX:true,
				scrollY:false,
				click:true
			})
		},
		_getDateArray(n) {
	    	let today = new Date(); //获取今天日期
	    	const weeks = ['周日','周一','周二','周三','周四','周五','周六',]
			today.setDate(today.getDate() - n);
			let dateArray = [];
			let step = 1;
			for (var i = 0; i <= n; i++) {
				let dateTemp = {}
				dateTemp.date = this._pad((today.getMonth()+1))+"-"+ this._pad(today.getDate())
			    dateTemp.week = weeks[today.getDay()]
			    dateArray.push(dateTemp);
			    today.setDate(today.getDate() + step);
			}
			return dateArray
	    },
	    _pad(num, n = 2) {
	        let len = num.toString().length
	        while (len < n) {
	          num = '0' + num
	          len++
	        }
	        return num
	    },
	    _setDateWrapWidth(){
	    	let dateWrap = this.$refs.sliderGroup;
	    	let childrens = null;
	    	if(dateWrap && dateWrap.children){
	    		childrens = dateWrap.children;
	    	}
	    	this.dateWrapWidth = 0;
	    	let dateWidth = 0;
	    	// if(childrens && childrens[0]){
	    	// 	dateWidth = childrens[0].clientWidth + 1;
	    	// }
				// console.log(dateWidth)
			dateWidth = document.getElementsByTagName('html')[0].style.fontSize;
	    	this.dateWrapWidth = parseFloat(dateWidth) * 2 * 31;
	    	dateWrap.style.width = Math.ceil(this.dateWrapWidth) + 'px';
				// console.log(this.dateWrapWidth)
	    },
	    scrollTo() {
	    	this.slider && this.slider.scrollTo(-this.dateWrapWidth,0,650)
	    },
	    refresh() {
            this.slider && this.slider.refresh()
        },
        getDatePrograms(index, date){
        	this.currentDateIndex = index;//选中
        	this.$emit('clickItem',date)
        }
	}
}

</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin.styl'
.slider
	position: fixed
	top $items-list-date-top
	left 0
	right 0
	height $items-date-height
	line-height $items-date-height
	background #fff
	border-bottom 0.5px solid $color
	box-sizing border-box
	overflow-x hidden
	.slider-group
		white-space nowrap
		box-sizing border-box
		height 100%
		.date
			position: relative
			float left
			display inline-block
			width 150px
			text-align center
			.week
				display block
				width 100%
				height 60px
				line-height 70px
				font-size 28px
			.day
				display block
				widht 100%
				height 60px
				line-height 30px
				font-size 26px
				color #666
			.dot
				position: absolute
				bottom 4px
				left 50%
				transform translateX(-50%)
				width 16px
				height 16px
				border-radius 50%
				background #1ba2ff
</style>
