<template>	
    <div class="date-pick" ref="slider">
        <navigator
            direction="horizontal" 
            :navList="dateArray" 
            :currentTabIndex="currentDateIndex" 
            @change="getDatePrograms"
        >
           
            <div
                slot="item"
                class="date"
                slot-scope="props"
               
            >
                <span class="week">{{props.week}}</span>
                <span class="day">{{props.date}}</span>
                <span class="dot" v-show="currentDateIndex == props.index"></span>            
            </div>
            
        </navigator>
    </div>
</template>

<script>
import Navigator from '@/base/navigator/navigator'

import { _pad } from '@/common/js/util'

export default {
    name:'date-pick',
    components:{
        Navigator
    },
	data() {
		return {
            currentDateIndex:30     
		}
	},	
	computed:{
		dateArray() {
			let dateArr = this._getDateArray(30)
			this.currentDateIndex = dateArr.length - 1;
			return dateArr
		}
	},	
	methods:{
		_getDateArray(n) {
	    	let today = new Date(); //获取今天日期
	    	const weeks = ['周日','周一','周二','周三','周四','周五','周六',]
			today.setDate(today.getDate() - n);
			let dateArray = [];
			let step = 1;
			for (var i = 0; i <= n; i++) {
                let dateTemp = {}
                let id = i+1;
                let date = _pad((today.getMonth()+1))+"-"+ _pad(today.getDate())
                let week = weeks[today.getDay()]
                dateTemp = {id,date,week}
			    dateArray.push(dateTemp);
			    today.setDate(today.getDate() + step);
			}
			return dateArray
	    },	   
        getDatePrograms(item){
            let index = item.id - 1;
        	this.currentDateIndex = index; //选中
        	this.$emit('clickItem',item)
        }
	}
}

</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin.styl'
.date-pick
    position: fixed
    top $items-list-date-top
    left 0
    right 0
    height $items-date-height    
    line-height $items-date-height
    background #fff
    border-bottom 0.5px solid $color    
    box-sizing border-box
    .date
        position: relative
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
            width 100%
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
