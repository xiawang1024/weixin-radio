<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <keep-alive include="channel">
          <router-view class="child-view"></router-view>
      </keep-alive>
    </transition>
    <wx-audio></wx-audio>
  </div>
</template>

<script>
import WxAudio from '@/base/audio/audio'

import { initShareConf, wxReady } from '@/wechat'

export default {
	name: 'app',
	components:{
		WxAudio
	},
	data() {
		return {
			transitionName:'fade'
		}
	},
	watch: {
		'$route' (to, from) {
			//页面切换动画
			if(from.fullPath == '/') {
				this.transitionName = 'fade'
			}else{
				const toDepth = to.meta.path.split('/').length
				const fromDepth = from.meta.path.split('/').length      				
				this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'				
			}

			//分享设置				 				
			setTimeout(() => {
				this.$nextTick(() => {
					let isChannel = to.name == 'channel'
					let storeShareConf = this.$store.state.shareConf
					let shareConf = initShareConf(isChannel, storeShareConf,to)
					wxReady(shareConf)
				})		
			}, 1000);
		}
	}
}
</script>

<style scoped lang="stylus">
.child-view 
  position: absolute
  transition: all .5s cubic-bezier(.55,0,.1,1)
.slide-left-enter, .slide-right-leave-active 
  opacity: 0
  transform: translate(30px, 0)
.slide-left-leave-active, .slide-right-enter 
  opacity: 0
  transform: translate(-30px, 0)
.fade-enter-active, .fade-leave-active
  transition: opacity 0.5s
.fade-enter, .fade-leave-to
  opacity 0
</style>
