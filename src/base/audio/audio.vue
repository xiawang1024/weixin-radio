<template>
    <div class="audio-wrap">
    	<audio id="audio" autoplay width="0" height="0"></audio>
    </div>
</template>

<script>
import audioAutoPlay from 'common/js/audioAutoPlay'
export default {
  mounted () {
    audioAutoPlay('audio')
  }
}
</script>


<style lang="stylus" scoped>

</style>
