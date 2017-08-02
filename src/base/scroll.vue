<template>
  <div ref="wrapper" class="scroll-wrap">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props:{
        probeType:{
            type:Number,
            default:1
        },
        click:{
            type:Boolean,
            default:true
        },
        data:{
            type:Array,
            default:null
        },
        scrollX:{
            type:Boolean,
            default:false
        },
        scrollY:{
            type:Boolean,
            default:true
        }
    },
    mounted() {
        setTimeout(() => {
            this._initScroll()
        },20)
        window.addEventListener('resize', () => {
            if (!this.scroll) {
              return
            }
            setTimeout(() => {
                this.scroll.refresh()
            },500)
            
        })
    },
    methods:{
        _initScroll() {
            if(!this.$refs.wrapper) {
                return 
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType:this.probeType,
                click:this.click,
                scrollX:this.scrollX,
                scrollY:this.scrollY
            })
        },
        enable() {
            this.scroll && this.scroll.enable()
        },
        disable() {
            this.scroll && this.scroll.disable()
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        }
    },
    watch:{
        data() {
            setTimeout(() => {
                this.refresh()
            },20)
        }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
