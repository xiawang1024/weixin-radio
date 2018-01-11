<template>
    <div class="comment-list">
        <scroll
            ref="scroll"
            :data="commentList"
            :pullDownRefresh = "pullDownRefresh"
            :pullUpLoad="pullUpLoad"
            @pullingDown = "onPullingDown"
            @pullingUp="onPullingUp"
        >            
            <div class="list" v-for="item of commentList" :key="item.id">
                <img :src="item.icon || defaultAvatar" alt="" class="avatar">
                <div class="text-wrap">
                    <span class="time">{{item.create_time | timeStamp2LocalTime}}</span>
                    <h5 class="name">{{item.creater}}</h5>
                    <p class="content">
                        {{item.content}}
                    </p>
                </div>
            </div>            
        </scroll>
    </div>
</template>


<script>
import Scroll from '@/base/scroll'

import { getCommentList } from 'api/index'

export default {
    name:'comment-list',
    components:{
       Scroll 
    },
    data () {
        return {
            defaultAvatar:require('./default-avatar.png'),
            commentList:[],
            listLen:1,
			pullDownRefresh:{
				txt:'更新成功',
                stop:60,
                threshold:80
            },
            pullUpLoad:{
                txt:{
                    more:'玩命加载中',
                    noMore:'没有更多数据'
                },
                threshold:0
            },
        }
    },
    props:{
        cid:{
            type:String,
            default:''
        }
    },
   
    created () {
        if(this.cid) {
            this._getCommentList(this.cid)
        }
    },
    watch :{
        cid () {
            this._getCommentList(this.cid)
        }
    },
    methods:{
        refresh() {            
            this.$refs.scroll.refresh()
        },
        //互动模块
		_getCommentList(id) {
			return getCommentList(id).then((res) => {
				let data = res.data
				if(data.success) {
					this.commentList = data.result.list
				}
			})
		},
		onPullingDown () {
			this._getCommentList(this.cid)
        },
        onPullingUp () {
            this.listLen++;
            getCommentList(this.cid,-1,this.listLen).then((res) => {
                let data = res.data
                if(data.result) {
                    this.commentList = this.commentList.concat(data.result.list)
                }else{
                    this.$refs.scroll.forceUpdate(false)
                }
            })        
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
        display flex
        width 100%
        padding 20px
        margin-bottom 10px
        box-sizing border-box
        // border-1px($color)
        .avatar 
            display block
            width 80px
            height 80px
            border-radius 50%
        .text-wrap
            position relative
            flex 1
            margin-left 30px
            padding-right 20px
            box-sizing border-box
            .time
                position absolute
                top 0
                right 0
                font-size 22px
                color #999999
            .name
                font-size 26px
                font-weight 500
                color #666666
            .content
                margin-top 30px
                line-height 1.6125
                font-size 30px
                color #000000
</style>
