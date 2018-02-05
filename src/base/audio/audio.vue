<template>
    <div class="audio-wrap">
    	<audio id="audio" autoplay width="0" height="0"></audio>
    </div>
</template>

<script>
import audioAutoPlay from 'common/js/audioAutoPlay'
export default {
	mounted () {
		this.audio = document.getElementById('audio')
		audioAutoPlay('audio')
	},
	watch:{
		'$route' (to, from) {
			console.log(to)
			let pathName = to.name
			if(pathName == 'live') {
				this.audio.pause()
			}else{
				this.audio.play()
			}

		}
	}
}
</script>


<style lang="stylus" scoped>

</style>
