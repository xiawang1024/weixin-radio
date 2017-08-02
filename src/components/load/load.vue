<template>
	<div class="loadapp">
		<a href="http://www.hndt.com/app/download/index.html" target="_bank">打开APP</a>
	</div>
</template>

<script>
export default {
	name:'loadapp'
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin.styl'
.loadapp
	width 130px
	height 60px
	line-height 60px
	border-radius 8px
	background #1ba2ff
	a
		display inline-block
		width 100%
		height 100%	
		color #fff
		font-size 26px
</style>