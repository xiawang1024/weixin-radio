<template>
  <div class="loading">
    <img class="img" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '玩命加载...'
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/mixin.styl'
.loading
  position relative
  z-index 100
  width: 100%
  text-align: center
  font-size 0
  margin-top 200px
  .img
    display inline-block
    width 80px
    height 80px
  .desc
    line-height: 80px
    font-size: 28px
    color: #000
</style>
