<template>
  <div class="audio-wrap">
    <audio id="audio" autoplay width="0" height="0" src='http://stream.hndt.com/city/hami0/playlist.m3u8'></audio>
  </div>
</template>

<script>
import audioAutoPlay from 'common/js/audioAutoPlay'
export default {
  mounted() {
    this.audio = document.getElementById('audio')
    audioAutoPlay('audio')
  },
  watch: {
    $route(to, from) {
      console.log(to)
      let pathName = to.name
      // if(pathName == 'live') {
      // 	this.audio.pause()
      // }else{
      // 	this.audio.play()
      // }
    }
  }
}
</script>


<style lang="stylus" scoped>
</style>
