<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <keep-alive :include="['channel']">
          <router-view></router-view>
      </keep-alive>
    </transition>
    <div class="audio-wrap">
    	<audio id="audio" autoplay width="0" height="0"></audio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
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
  transition: opacity 0.1s
.fade-enter, .fade-leave-to
  opctity 0
</style>
