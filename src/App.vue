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
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      console.log('------------------------------------');
      console.log(toDepth,fromDepth);
      console.log('------------------------------------');
      if(toDepth == fromDepth) {
        this.transitionName = 'fade'
      }else{
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    }
  },
  mounted() {
    console.log(this.$router)
  	this.audio = document.getElementById('audio');
    var me = this
  	this.canPlay = true
  	document.getElementsByTagName('body')[0].addEventListener('touchstart',() => {
  		if(this.audio && this.audio.getAttribute('src') && this.canPlay){
	  		this.audio.play()
	  		me.canPlay = false
	  	}
  	})
  }
}
</script>

<style scoped lang="stylus">
.child-view 
  position: absolute
  transition: all .3s cubic-bezier(.55,0,.1,1)
.slide-left-enter, .slide-right-leave-active 
  opacity: 0
  transform: translate(30px, 0)
.slide-left-leave-active, .slide-right-enter 
  opacity: 0
  transform: translate(-30px, 0)
.fade-enter-active, .fade-leave-active
  transition: opacity 0.3s
.fade-enter, .fade-leave-to
  opctity 0
</style>
