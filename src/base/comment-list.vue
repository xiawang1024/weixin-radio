<template>
    <div class="comment-list">
        <scroll
            ref="scroll"
            :data="commentList"
        >            
            <div class="list" v-for="item of commentList">{{item}}</div>            
        </scroll>
    </div>
</template>


<script>
import Scroll from '@/base/scroll'

export default {
    name:'comment-list',
    components:{
       Scroll 
    },
    data () {
        return {

        }
    },
    props:{
        commentList:{
            type:Array,
            default:function () {
                return []
            }
        }
    },
    methods:{
        refresh() {            
            this.$refs.scroll.refresh()
        }
    }
}
</script>


<style lang="stylus" scoped>
@import '~common/stylus/mixin.styl'
.comment-list
    position fixed
    top $items-list-date-top
    bottom 0
    left 0
    right 0
    overflow hidden
    .list
        line-height 5
</style>
