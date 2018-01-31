<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <keep-alive include="channel">
          <router-view></router-view>
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
.fade-enter-active, .fade-leave-active
  transition: opacity 0.25s
.fade-enter, .fade-leave-to
  opctity 0
</style>
