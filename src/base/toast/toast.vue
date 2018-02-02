<template>
  <div class="wx-toast">
      <div class="toast-wrap animated fadeInDown" v-show="isShowToast">
          {{msg}}
      </div>
  </div>
</template>


<script>
export default {
    props:{
        msg:{
            type:String,
            default:'toast'
        },
        isShowToast:{
            type:Boolean,
            default:false
        },
        interval:{
            type:Number,
            default:3000
        }
    }
}
</script>


<style lang="stylus" scoped>
@import '~common/stylus/mixin.styl'
@keyframes fadeInDown 
    from 
        opacity 0
        transform: translate3d(0, 100%, 0)
    to
        opacity 1
        transform: none
.animated     
    animation-duration: 0.7s    
    animation-fill-mode: both
    animation-timing-function ease
    &.fadeInDown
        animation-name fadeInDown
.wx-toast
    position absolute
    z-index 1024
    top 50%
    left 50%
    transform translate(-50%,-50%)
    max-width 100%
    .toast-wrap
        display flex
        align-items center
        justify-content space-around
        padding 20px 30px
        border-radius 6px
        line-height 1.6125
        font-size 28px
        color #ffffff
        background rgba(0,0,0,.75)
</style>
