<template>
  <div class="live">
      <div class="hd">
          <span class="icon-back back" @click="goToItem"></span>
          <img src="http://program.hndt.com/files/images/2017/06/23/1498188274587475.png" alt="" class="img">
      </div>
      <div class="video-wrap">
          <video id="video" class="video-play" :src="liveStream" webkit-playsinline style="object-fit:fill" autoplay></video>
          <div class="controls">
              <div class="playOrPause">
                  <span
					:class="playBtn ? 'icon-pause' : 'icon-play'"
                    @click="playSwitch"
				  ></span>
              </div>
          </div>
      </div>
      <div class="tab">
          <span class="tab-item" :class="tabBtn ? 'z-crt' : ''" @click="tabSwitch">推荐</span>
          <span class="tab-item" :class="!tabBtn ? 'z-crt' : ''" @click="tabSwitch">评论</span>
      </div>
      <div class="tab-wrap">
          <div class="tab-item recommend-tab" v-show="tabBtn">
            <div class="item" v-for="n of 10">
                <div class="img-wrap">
                    <img src="http://www.hndt.com/wap/978/1891990/res/8VCcCFWS.jpg?1498869074099" alt="" class="img">
                </div>
                <div class="text-wrap">
                    <h2 class="title">王者局排位韩信王者局排位韩信王者局排位韩信</h2>
                    <p class="desc">河南广电全媒体贯彻落实习近平河南广电全媒体贯彻落实习近平</p>
                </div>
            </div>
          </div>
          <div class="tab-item msg-tab" v-show="!tabBtn">
              <div class="item" v-for="n of 10">
                  <div class="avatar-wrap">
                      <img src="http://wx.qlogo.cn/mmopen/Q3auHgzwzM4jkjibDBUMBHHqcqjSUkRK9bCEZicLdTaJdwJ7pJjkLlfMxTicfxgkVJavVibOOZ5cxYbT0jA4ibH4AtA/0" alt="" class="avatar">
                  </div>
                  <div class="msg-wrap">
                      <h2 class="name">石头</h2>
                      <p class="msg">哈喽，主持人。说的真好哈喽，主持人。说的真好哈喽，主持人。说的真好哈喽，主持人。说的真好哈喽，主持人。说的真好</p>
                  </div>
              </div>
              <div class="msg-send">
                  <input type="text" class="send-ipt">
                  <button class="send-btn">发送</button>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name:'live',
  data() {
      return {
          liveStream:'http://www.hndt.com/h5/shows/03/videos/1.mp4',
          playBtn:true,
          tabBtn:true
      }
  },
  mounted() {
      this.video = document.querySelector('#video')
  },
  methods:{
      goToItem() {
          this.$router.push({path:'/items',query:{cid:3}})
      },
      playSwitch() {          
          if(this.video.paused) {
              this.video.play()
              this.playBtn = true;
          }else{
              this.video.pause()
              this.playBtn = false
          }
      },
      tabSwitch() {          
          this.tabBtn = !this.tabBtn
      }
  }
}
</script>


<style lang="stylus" scoped>
@import '~common/stylus/mixin.styl'
.live
    width 100%
    background #fff
    .hd
        position: relative
        width 100%
        height $items-hd-height
        line-height $items-hd-height
        text-align center
        border-1px($color)
        font-size 0
        .img
            vertical-align middle
            height 100px
        .back
            display inline-block
            position: absolute
            line-height $items-hd-height
            left 0
            width 120px
            font-size 60px
        .title
            font-size 44px
        .load
            position: absolute
            top 30px
            right 30px
    .video-wrap
        position relative
        width 100%
        overflow hidden
        // border-1px($color)
        .video-play
            width 100%
        .controls
            position absolute
            left 0
            bottom 0
            width 100%
            height 100px
            text-align right 
            .icon-play,.icon-pause       
                margin-right 30px         
                font-size 80px
                color #ffffff
    .tab
        width 100%
        height $items-hd-height
        line-height $items-hd-height
        display flex
        justify-content center
        align-items center
        border-1px($color)
        .tab-item
            flex 1
            text-align center
            font-size 38px
            &.z-crt
                color #0081dc
                border-bottom 4px solid #0081dc
    .tab-wrap
        width 100%
        padding 10px 30px
        box-sizing border-box
        .recommend-tab
            .item
                display flex
                align-items center
                width 100%
                padding 30px 0
                box-sizing border-box
                border-1px($color)
                .img-wrap
                    flex 0 0 3.06rem
                    width 230px
                    height 134px
                    .img
                        display block
                        width 100%
                        height 100% 
                .text-wrap
                    flex 0 0 6.13rem
                    width 460px
                    padding-left 20px
                    box-sizing border-box                
                    .title
                        font-size 36px
                        font-weight 500
                        no-wrap()
                        margin-bottom 14px
                        color #333333
                    .desc
                        font-size 24px
                        line-height 1.3
                        color #999999
        .msg-tab
            position relative
            padding-bottom $items-hd-height
            .item
                display flex
                align-items center
                width 100%
                padding 30px 0 
                box-sizing border-box
                .avatar-wrap
                    flex 0 0 80px
                    align-self flex-start
                    margin-top 10px
                    width 90px
                    .avatar
                        display block
                        width 90px
                        height 90px
                        border-radius 50%
                .msg-wrap                    
                    flex 0 0 8rem
                    width 600px
                    padding-left 30px
                    box-sizing border-box
                    .name
                        margin-bottom 20px
                        font-size 30px
                        color #666666
                    .msg
                        padding 20px
                        border-radius 8px
                        font-size 24px
                        line-height 1.6
                        background #eeeeee
                        color #333333
            .msg-send
                position fixed
                bottom 0
                left 0
                width 100%
                display flex
                justify-content space-around
                align-items center
                height $items-hd-height
                border-top 1px solid #bebebe
                background #ffffff
                .send-ipt
                    width 570px
                    height 64px
                    border 1px solid #0081dc
                    border-radius 32px
                    padding-left 30px
                    box-sizing border-box
                    font-size 28px
                .send-btn
                    width 96px
                    height 64px
                    border none 
                    outline none 
                    border-radius 6px
                    background #0081dc
                    color #ffffff
                    font-size 30px
                    &:active
                        background #0868ad
</style>
