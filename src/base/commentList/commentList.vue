<template>
    <div class="comment-list">
        <scroll
            class="list-wrap"
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
        <div class="send-wrap" @click="tips">
            <input type="text" class="ipt" placeholder="我想说..." disabled>
            <button class="btn">发送</button>
        </div>
        <vodal className="my-dialog" :width="4" :height='1.6' measure="rem" :mask="false" :closeButton="false" :duration="301" :show="isShowToast" animation="zoom" @hide="isShowToast = false" :customStyles="customStyles">			
			{{msg}}	
		</vodal>
    </div>
</template>


<script>
import Scroll from '@/base/scroll/scroll'

import dialogConf from 'common/js/dialog.js'
import { getCommentList } from 'api/index'

export default {
    name:'comment-list',
    components:{
       Scroll,
    //    Toast
    },
    data () {
        return {
            customStyles:dialogConf,//模态框css配置
            defaultAvatar:require('./default-avatar.png'),
            commentList:[],
            pageIndex:1,
            listLen:0,
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
            isShowToast:false,
            msg:'暂未开通评论'
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
                    this.listLen = data.result.pages-1
					this.commentList = data.result.list
				}
			})
		},
		onPullingDown () {
			this._getCommentList(this.cid)
        },
        onPullingUp () {
            this.pageIndex++;
            getCommentList(this.cid,-1,this.pageIndex).then((res) => {
                let data = res.data
                
                if(data.result) {
                    this.commentList = this.commentList.concat(data.result.list)
                }else{
                    this.$refs.scroll.forceUpdate()
                }
            })        
        },
        tips() {
            this.msg = '请打开河南广播APP体验更多功能！'
            this.isShowToast = true
            setTimeout(() => {
                this.isShowToast = false
            }, 2000);
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
    .list-wrap
        position absolute
        top 0
        bottom 100px
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
    .send-wrap
        display flex
        align-items center
        justify-content space-around
        position absolute
        bottom 0
        left 0
        right 0
        height 90px
        background #ffffff
        border-top 1px solid $color
        .ipt
            width 500px
            height 70px
            border 1px solid $color
            border-radius 80px
            padding-left 40px
            box-sizing border-box
            font-size 30px
        .btn
            width 160px
            height 60px
            background #0081dc
            color #ffffff
            font-size 30px
            border none
            border-radius 8px
</style>
