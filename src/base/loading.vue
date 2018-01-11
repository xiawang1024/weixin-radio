<template>
  <div class="mf-loading-container">
    <img src="./loading.gif">
  </div>
</template>
<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'loading'
  export default {
    name: COMPONENT_NAME
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin.styl'
.mf-loading-container
    img
        width: 50px
        height: 50px
        display: block
</style>