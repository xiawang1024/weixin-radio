<template>
	<div class="items">
		<div class="hd">
			<!-- <router-link to="/channel" tag='span' class="icon-back back"></router-link> -->
			<span class="icon-back back" @click="goToChannel"></span>
			<img src="./logo.png" alt="" class="img">
			<down-load class="load"></down-load>
		</div>
		<div class="audio-wrap" >
			<div class="item-logo" v-if="itemsInfo">
				<div class="img-wrap" ref="imgOuter">
					<img
						ref="imgInner"
						:src="'http://program.hndt.com' + itemsInfo.image"
						class="img"
						:class="playOrPause ? 'isPlay' : '' "
					>
				</div>
				<span
					:class=" playOrPause ? 'icon-pause' : 'icon-play'"
					@click="playSwitch"
				></span>
			</div>
			<div class="item-info" v-if="itemsInfo">
				<span class="icon-tv" @click="goToLive">TV</span>
				<p class="name" id="channel_name">{{itemsInfo.name}}</p>
				<p class="live-name">
					<i class="icon-LIVE" v-show="isLivePlay"></i>
					<span class="playback" v-show="!isLivePlay">回听</span>
					{{isLivePlay ? itemsInfo.live : playBackTitle}}
				</p>
				<p class="live-time" v-show="isLivePlay">
					<span>{{itemsInfo.time}}</span>
				</p>
				<p class="live-time progress-wrap" v-show="!isLivePlay">
					<span class="time time-l">{{formatPlayTime(currentTime)}}</span>
					<span class="progress">
						<progress-bar
							:percent="percent"
							@percentChange="onProgressBarChange"
						></progress-bar>
					</span>
					<span class="tiem time-r">{{formatPlayTime(duration)}}</span>
				</p>
			</div>
		</div>
		<div class="tab-item">
			<div class="item" :class="{'z-crt':tabIndex == 0}" @click="tabSwitch(0)"><i class="icon-back-listen"></i><span>回听</span></div>
			<div class="item" :class="{'z-crt':tabIndex == 1}" @click="tabSwitch(1)"><i class="icon-comment"></i><span>互动</span></div>
		</div>	
		<!-- 回听start	 -->
		<div class="itemsList" v-show="tabIndex == 0">			
			<keep-alive>
				<date-pick
					@clickItem="getDatePrograms"
				></date-pick>
			</keep-alive>
			<scroll
				class="list-wrap"
				:data="itemsList"									
				ref="listview"
			>
				<div>
					<div class="list" v-for='(item, index) in itemsList' ref="list" :key="item.beginTime">
						<span class="item time">{{format(item.beginTime)}} - {{format(item.endTime)}}</span>
						<span class="item name">{{item.title}}</span>
						<span
							class="item isPlay"
							@click="playBackSrc(item,index)"
						>
							<i v-show="index === isPlayIndex && isToDay" class="icon-LIVE"></i>
							<span v-show="item.playUrl && item.playUrl.length > 0 && index !== isPlayIndex" class="playback">回听</span>
						</span>
					</div>
				</div>
			</scroll>
		</div>
		<!-- 回听end -->
		<!-- 互动start -->
		<comment-list 
			ref="child"
			:cid="itemsInfo && itemsInfo.cid"
			v-show="tabIndex == 1" 			
		></comment-list>
		<!-- 互动end -->
		<div class="netRadioDesc" v-show="itemsList.length==0">
			<div class="desc-wrap" v-if="itemsInfo">{{itemsInfo.description}}</div>
		</div>
		<vodal className="my-dialog" :width="4" :height='1.6' measure="rem" :mask="false" :closeButton="false" :duration="301" :show="isShowToast" animation="door" @hide="isShowToast = false" :customStyles="customStyles">			
			{{msg}}			
		</vodal>
	</div>
</template>

<script>
// const Hls = r => require.ensure([], () => r(require('hls'))) //如果是电脑端，则加载hls，否则不加载
// import Hls from 'hls'
import Scroll from '@/base/scroll/scroll'
import DatePick from '@/base/datePick/datePick'
import ProgressBar from '@/base/progressBar/progressBar'
import DownLoad from '@/base/downLoad/downLoad'
import CommentList from '@/base/commentList/commentList'

import { getChannelItem, clickItem, getCommentList } from 'api/index'
import { addClass } from 'common/js/dom.js'
import { isPc } from 'common/js/isPc.js'  //判断是否是电脑端
import dialogConf from 'common/js/dialog.js'
import { _pad } from 'common/js/util'

import COMMENTLIST from './comment.js'

export default {
	name:'items',
	components:{
		Scroll,
		DownLoad,
		DatePick,
		ProgressBar,
		// Toast,
		CommentList
	},
	data() {
		return {
			customStyles:dialogConf,//模态框css配置
			itemsInfo:null,//频率信息
			itemsList:[], //频率programs
			isPlayIndex:null, //直播index
			playOrPause:true,//播放暂停按钮
			isToDay:true, //是否是今天 ，是true，否false
			isLivePlay:true,//是否是直播
			liveStream:null,//直播流
			playBackTitle:'',//回听栏目title
			percent:0, //播放百分比
			currentTime:0, //当前播放时间
			duration:0, //播放总时间
			msg:'', //toast提示
			isShowToast:false, //是否显示toast
			tabIndex:0 //tab切换index			
		}
	},
	created() {
		this.parseQuery()		
	},
	mounted() {
		this.audio = document.getElementById('audio')
		if(this.audio.readyState == 4){
			if(this.audio.paused){
				this.playOrPause = false
			}else{
				this.playOrPause = true
			}
		}
		this.watchPlayPercent()
	},	
	methods:{
		_getCommentList(cid) {
			getCommentList(cid).then((res) => {
				let data = res.data
				if(data.success) {                    
					this.$store.dispatch('setCommentListInfo',data.result.list)
				}else{
					//暂未开通
					this.$store.dispatch('setCommentListInfo','')
				}
			})
		},
		_getChannelItem(cid) {
			let todayStamp = this._timeToStamp(this._getToDay());
			clickItem(cid, todayStamp).then((res) => {
				let data = res.data;
				this.$store.dispatch('setShareConf',data)
				this.itemsInfo = data;
				this.itemsList = data.programs;			
				if(data.cid == 120) {					
					this.liveStream = 'http://stream.hndt.com:1935/live2/1061_aac/playlist.m3u8'
				}else{
					this.liveStream = data.streams[0];
				}
								
				if(!this.audio.getAttribute('src')){					
					this._playSrc(this.liveStream)										
				}
				setTimeout(() => {
					this._isPlay(data.programs)					
				},20)
			})
		},
		_isPlay(programs) {
			let currentTime = (new Date()).getTime()/1000 | 0;//当前时间时间戳
			for(let i =0 ;i<programs.length;i++){
				var item = programs[i];
				if(currentTime <= item.endTime && currentTime >= item.beginTime){
					this.isPlayIndex = i;
					this._scrollTo(this.isPlayIndex)
					return
				}
			}
		},
		_scrollTo(index){
			let listHeight = this.$refs.list[0].clientHeight;
			let offsetY = parseInt(listHeight) * index
			this.$refs.listview.scroll && this.$refs.listview.scroll.scrollTo(0,-offsetY,1000)
		},
		_scrollTop(){
			this.$refs.listview.scroll && this.$refs.listview.scroll.scrollTo(0,0,1000)
		},
		_playSrc(stream) {
			// console.log(stream)
			if(this._isPc() && this._isM3u8(stream)){
				this._playHlsSrc(stream)
			}else{
				this.audio.setAttribute('src',stream)
			}			
		},
		playSwitch() {
			if(this.playOrPause){
				this.playOrPause = false
				// 微信animation-play-state兼容strat
				let [image,container] = [ this.$refs.imgInner, this.$refs.imgOuter]
				let iTransform = getComputedStyle(image).transform;				
				let cTransform = getComputedStyle(container).transform;
				container.style.transform = cTransform === 'none'
					? iTransform
					: iTransform.concat(' ', cTransform);
				// 微信animation-play-state兼容end	
				this.audio.pause()
			}else{
				this.playOrPause = true
				this.audio.play()
			}
		},
		parseQuery() {
			let query = this.$route.query
			let cid = query.cid;
			this.cid = cid;
			if(cid){
				this._getChannelItem(cid)
				// this._getCommentList(cid)
			}else{
				this._getChannelItem(1)
				// this._getCommentList(1)
			}
		},
		goToChannel() {
			this.$router.push({path:'/channel',query:{isPlayIndex:this.cid}})
		},
		format(interval){
			let val = parseInt(interval) * 1000;
			let time = new Date(val);
			const hour = _pad(time.getHours());
			const min = _pad(time.getMinutes());
			return `${hour}:${min}`
		},
		formatPlayTime(interval) {
			interval = interval | 0
			const minute = _pad(interval / 60 | 0)
			const second = _pad(interval % 60)
			return `${minute}:${second}`
		},		
		//点播列表
		getDatePrograms(date){
			let cid = this.cid;
			let year = (new Date()).getFullYear();
			let month = _pad(new Date().getMonth() + 1);
			let day = _pad(new Date().getDate())
			let time = year + '-' + date.date + ' 00:00:00.0';
			let stamp = this._timeToStamp(time)
			let nowDate = month +'-'+ day;
			if(nowDate == date.date){// 如果点击的是今天，那么跳动到直播
				this.isToDay = true
			}else{
				this.isToDay = false
			}
			this._getItems(this.cid, stamp, !this.isToDay)
		},
		playBackSrc(item, index) {
			let playUrl = item.playUrl;
			if(index == this.isPlayIndex){// 如果相等，则是直播，否则是点播
				this.isLivePlay = true
				this._playSrc(this.liveStream)
			}else{
				this.isLivePlay = false
				if(!playUrl){
					return
				}else{
					if(playUrl.length == 0){
						return
					}else{
						//回听
						this.playBackTitle = item.title;
						this._playSrc(playUrl[0])
					}
				}
			}
		},
		_getToDay() {
			let year = (new Date()).getFullYear();
			let month = _pad(new Date().getMonth() + 1);
			let day = _pad(new Date().getDate())
			let today =`${year}-${month}-${day} 00:00:00.0`
			return today
		},
		//时间转时间戳
		_timeToStamp(date){
			// var date = '2015-03-05 00:00:00.0';
			date = date.substring(0,19);
			date = date.replace(/-/g,'/');
			var timestamp = new Date(date).getTime();
			return timestamp/1000;
		},
		_getItems(cid,time,isScrollTop){
			clickItem(cid, time).then((res) => {
				let data = res.data;
				this.itemsList = data.programs
				if(isScrollTop){
					this._scrollTop()
				}else{
					this._scrollTo(this.isPlayIndex)
				}
			})
		},
		//监听播放信息
		watchPlayPercent() {
			this.audio.addEventListener('timeupdate',(e) => {
				const currentTime = e.target.currentTime;
				const duration = e.target.duration
				this.currentTime = currentTime
				this.duration = duration
				this.percent = currentTime / duration
			})
		},
		onProgressBarChange(percent) {
			const currentTime = this.audio.duration * percent
			this.audio.currentTime = currentTime
		},
		//判断是否是pc设备
		_isPc(){
			if(isPc() == 'pc'){
				return true
			}else{
				return false
			}
		},
		//判断是否是m3u8
		_isM3u8(stream) {
			let patt = /m3u8$/;
			return patt.test(stream)
		},
		//pc设备通过hls.js插件播放，异步加载hls.js
		_playHlsSrc(stream){
			if(this._isPc()){
				require.ensure([], () => {
					const Hls = require('hls')
					this.hls = new Hls();
					if(Hls.isSupported()) {
						this.hls.loadSource(stream);
						this.hls.attachMedia(this.audio);
						this.hls.on(Hls.Events.MANIFEST_PARSED,function() {
							this.audio.play();
						});
					}
				})
			}
		},
		//tab切换 回听/互动
		tabSwitch (index) {
			var arr = COMMENTLIST			
			if(index == 1) {
				if(arr.indexOf(parseInt(this.itemsInfo.cid)) != -1){
					this.tabIndex = index
					this.$nextTick(() => {
						this.$refs.child.refresh()
					})	
				}else{
					this._toast('互动暂未开通！')
				}		
			}else {
				this.tabIndex = index
			}	
		},		
		goToLive() {						
			this._toast('视频功能暂未开放！')			
			//暂不开放视频直播页面
			// this.$router.push({path:'/channel/items/live',query:{cid:this.cid}})
		},
		_toast (msg) {
			this.msg = msg
			this.isShowToast = true
			setTimeout(() => {
				this.isShowToast = false
			}, 2000);
		}
	}
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin.styl'

@keyframes rotate
    100%
        transform rotate(360deg)
.toast
	width 200px
	height 60px
	background #f0f
.items
	width 100%
	background #fff
	.hd
		position: relative
		width 100%
		height $items-hd-height
		line-height $items-hd-height
		text-align center
		border-1px($color)
		font-size 0
		.img
			vertical-align middle
			width 300px
		.back
			display inline-block
			position: absolute
			line-height $items-hd-height
			left 0
			width 120px
			font-size 60px
		.title
			font-size 44px
		.load
			position: absolute
			top 20px
			right 30px
	.audio-wrap
		width 100%
		height $items-audio-height
		display flex
		align-items center
		border-1px($color)
		.item-logo
			flex 2
			text-align center
			position: relative
			font-size 0
			.img
				width 240px
				height 240px
				border-radius 50%
				border 2px solid $color				
				&.isPlay
					animation rotate 10s linear infinite					
			.icon-play,.icon-pause
				position: absolute
				left 50%
				top 50%
				transform translate(-50%,-50%)
				font-size 120px
				color #1ba2ff
				opacity 0.8
		.item-info
			position relative
			flex 3
			text-align left
			.icon-tv
				position absolute
				top 10px
				right 20px
				display inline-block
				padding 4px 10px
				border 2px solid #0081dc
				border-radius 4px
				color #0081dc
				&:before
					content: ''
					position: absolute
					top: -16px
					left: -16px
					right: -16px
					bottom: -16px
			p
				line-height 2
				&.name
					font-size 40px
				&.live-name
					font-size 36px
					height 84px
					color #666
					no-wrap()
					max-width 440px //最大宽度450px
					.icon-LIVE
						font-size 84px
						vertical-align middle
					.playback
						vertical-align middle
						padding 6px 10px
						background #888
						color #fff
						font-size 24px
						border-radius 6px
				&.live-time
					font-size 36px
					color #999
				&.progress-wrap
					position: relative
					height 72px
					width 400px
					.time-l
						position: absolute
						left -12px
						top 24px
						font-size 24px
					.time-r
						position: absolute
						right -24px
						top 24px
						font-size 24px
	.tab-item
		display flex
		align-items center
		width 100%
		height $items-items-title
		border-1px($color)
		padding 0 20px
		box-sizing border-box
		font-size 28px
		font-weight 500
		.item
			padding 20px
			color #333333		
			&.z-crt
				color #0081dc	
			i 				
				font-size 38px
				vertical-align middle
				margin-right 2px	
			span
				vertical-align middle	
	.itemsList
		width 100%
		overflow hidden
		.title
			width 100%
			height $items-items-title
			line-height $items-items-title
			padding-left 30px
			font-size 30px
			font-weight 700
			border-1px($color)
			box-sizing border-box
		.list-wrap
			position: fixed
			top $items-list-wrap-top
			width 100%
			background #fff
			bottom 0
			width 100%
			overflow hidden
			.list
				display flex
				height $items-item-list
				line-height $items-item-list
				border-1px($color)
				box-sizing border-box
				font-size 32px
				.time
					flex 2
					text-align center
					color #333
				.name
					flex 3
					text-align center
					no-wrap()
				.isPlay
					flex 1
					text-align center
					.icon-LIVE
						font-size 100px
					.playback
						padding 6px 10px
						background #888
						color #fff
						font-size 26px
						border-radius 6px
	.netRadioDesc
		width 100%
		position: fixed
		top $items-netRadioDesc-top
		bottom 0
		overflow auto
		-webkit-overflow-scrolling: touch
		background #fff
		.desc-wrap
			width 100%
			padding 60px 100px
			box-sizing border-box
			line-height 2
			letter-spacing: 2px
			font-size 34px
			text-align center
</style>
