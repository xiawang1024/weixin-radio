<template>
  <div class="live">
    <div class="hd">
      <span class="icon-back back" @click="goToItem"></span>
      <img :src="channelLogo" alt class="img">
      <down-load class="load"></down-load>
    </div>
    <div class="video-wrap">
      <transition name="fade">
        <div class="video-control" v-show="videoControl" @click="playVideo">
          <div class="state">
            <span :class="videoAnimateTypeArr[videoAnimateType]"></span>
          </div>
        </div>
      </transition>
      <video
        @click.stop="pauseVideo"
        @timeupdate="timeUpdate"
        @waiting="waiting"
        @playing="playing"
        id="video"
        x-webkit-airplay="true"
        x5-video-player-type="h5"
        playsinline="true"
        webkit-playsinline
        style="object-fit:fill"
        preload="auto"
      ></video>
    </div>
    <div class="tab">
      <span class="tab-item" :class="tabIndex == 0 ? 'z-crt' : ''" @click="tabSwitch(0)">推荐</span>
      <span class="tab-item" :class="tabIndex == 1 ? 'z-crt' : ''" @click="tabSwitch(1)">评论</span>
    </div>
    <!-- <div class="tab-item recommend-tab" v-show="tabBtn">
            <div class="item" v-for="n of 10">
                <div class="img-wrap">
                    <img src="http://www.hndt.com/wap/978/1891990/res/8VCcCFWS.jpg?1498869074099" alt="" class="img">
                </div>
                <div class="text-wrap">
                    <h2 class="title">王者局排位韩信王者局排位韩信王者局排位韩信</h2>
                    <p class="desc">河南广电全媒体贯彻落实习近平河南广电全媒体贯彻落实习近平</p>
                </div>
            </div>
    </div>-->
    <comment-list class="comment-list" ref="child" :cid="cid" v-show="tabIndex == 1"></comment-list>
    <vodal
      class="my-dialog"
      :width="4"
      :height="1.6"
      measure="rem"
      :mask="false"
      :closeButton="false"
      :duration="301"
      :show="isShowToast"
      animation="zoom"
      @hide="isShowToast = false"
      :customStyles="customStyles"
    >{{msg}}</vodal>
  </div>
</template>

<script>
import Scroll from "@/base/scroll/scroll";
import CommentList from "@/base/commentList/commentList";

import DownLoad from "@/base/downLoad/downLoad";

import { getChannelItem } from "api/index";

import { isPc } from "common/js/isPc.js";

import dialogConf from "common/js/dialog.js";

export default {
  name: "live",
  components: {
    Scroll,
    CommentList,
    DownLoad
  },
  data() {
    return {
      customStyles: dialogConf, //模态框css配置
      cid: "",
      channelLogo: "",
      liveStream: "http://ivi.bupt.edu.cn/hls/cctv13.m3u8",
      playBtn: true,
      tabIndex: 1,
      msg: "暂未开通功能！",
      isShowToast: false,
      videoControl: true,
      videoAnimateTypeArr: ["icon-play", "icon-loading"],
      videoAnimateType: 0
    };
  },
  created() {
    this._parseQuery();
  },
  mounted() {
    this.video = document.getElementById("video");
  },
  methods: {
    playVideo() {
      this.video.play();
    },
    pauseVideo() {
      this.video.pause();
      this.$nextTick(() => {
        this.videoControl = true;
      });
    },
    timeUpdate(e) {
      this.videoControl = false;
    },
    playing(e) {
      this.videoControl = false;
      this.videoAnimateType = 0;
    },
    waiting(e) {
      this.videoAnimateType = 1;
      this.videoControl = true;
    },
    _parseQuery() {
      let query = this.$route.query;
      let cid = query.cid;
      this.cid = cid;
      if (cid) {
        this._getChannelItem(cid).then(res => {
          let data = res.data;
          this.$store.dispatch("setShareConf", data);
          this.channelLogo = `http://program.hndt.com${data.image}`;
          this.liveStream =
            data.video_streams[0] || "http://ivi.bupt.edu.cn/hls/cctv13.m3u8";

          this._playSrc(this.liveStream);
        });
      }
    },
    _getChannelItem(cid) {
      return Promise.resolve(getChannelItem(cid));
    },
    goToItem() {
      this.$router.push({ path: "/items", query: { cid: this.cid } });
    },
    tabSwitch(index) {
      this.tabIndex = index;
      if (index == 0) {
        this.isShowToast = true;
        setTimeout(() => {
          this.isShowToast = false;
        }, 3000);
      }
      this.$nextTick(() => {
        this.$refs.child.refresh();
      });
    },
    _playSrc(stream) {
      if (this._isPc() && this._isM3u8(stream)) {
        this._playHlsSrc(stream);
      } else {
        this.video.setAttribute("src", stream);
      }
    },
    //判断是否是pc设备
    _isPc() {
      if (isPc() == "pc") {
        return true;
      } else {
        return false;
      }
    },
    //判断是否是m3u8
    _isM3u8(stream) {
      let patt = /m3u8$/;
      return patt.test(stream);
    },
    //pc设备通过hls.js插件播放，异步加载hls.js
    _playHlsSrc(stream) {
      if (this._isPc()) {
        require.ensure([], () => {
          const Hls = require("hls.js");
          this.hls = new Hls();
          if (Hls.isSupported()) {
            this.hls.loadSource(stream);
            this.hls.attachMedia(this.video);
            this.hls.on(Hls.Events.MANIFEST_PARSED, function() {
              // this.video.play();
            });
          }
        });
      }
    }
  }
};
</script>


<style lang="stylus" scoped>
@import '~common/stylus/mixin.styl';

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.live {
  width: 100%;
  background: #fff;

  .hd {
    position: relative;
    width: 100%;
    height: $items-hd-height;
    line-height: $items-hd-height;
    text-align: center;
    // border-1px($color)
    font-size: 0;

    .img {
      vertical-align: middle;
      height: 80px;
    }

    .back {
      display: inline-block;
      position: absolute;
      line-height: $items-hd-height;
      left: 0;
      width: 120px;
      font-size: 60px;
    }

    .title {
      font-size: 44px;
    }

    .load {
      position: absolute;
      top: 20px;
      right: 30px;
    }
  }

  .video-wrap {
    position: relative;
    width: 100%;
    height: 421px;
    overflow: hidden;
    background: #ffffff;

    .video-control {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.8);

      .state {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 180px;
        height: 180px;
        margin: auto auto;

        .icon-loading {
          display: inline-block;
          width: 180px;
          height: 180px;
          background: url('./loading.gif') center center no-repeat;
          background-size: cover;
        }

        .icon-play, .icon-pause {
          font-size: 180px;
          color: #ffffff;
        }
      }
    }
  }

  .tab {
    width: 100%;
    height: 100px;
    line-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-1px($color);

    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 34px;

      &.z-crt {
        color: #0081dc;
        border-bottom: 4px solid #0081dc;
      }
    }
  }

  .recommend-tab {
    .item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 30px 0;
      box-sizing: border-box;
      border-1px($color);

      .img-wrap {
        flex: 0 0 3.06rem;
        width: 230px;
        height: 134px;

        .img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .text-wrap {
        flex: 0 0 6.13rem;
        width: 460px;
        padding-left: 20px;
        box-sizing: border-box;

        .title {
          font-size: 36px;
          font-weight: 500;
          no-wrap();
          margin-bottom: 14px;
          color: #333333;
        }

        .desc {
          font-size: 24px;
          line-height: 1.3;
          color: #999999;
        }
      }
    }
  }

  .comment-list {
    top: 644px;

    .item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 30px 0;
      box-sizing: border-box;

      .avatar-wrap {
        flex: 0 0 80px;
        align-self: flex-start;
        margin-top: 10px;
        width: 90px;

        .avatar {
          display: block;
          width: 90px;
          height: 90px;
          border-radius: 50%;
        }
      }

      .msg-wrap {
        flex: 0 0 8rem;
        width: 600px;
        padding-left: 30px;
        box-sizing: border-box;

        .name {
          margin-bottom: 20px;
          font-size: 30px;
          color: #666666;
        }

        .msg {
          padding: 20px;
          border-radius: 8px;
          font-size: 24px;
          line-height: 1.6;
          background: #eeeeee;
          color: #333333;
        }
      }
    }

    .msg-send {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: $items-hd-height;
      border-top: 1px solid #bebebe;
      background: #ffffff;

      .send-ipt {
        width: 570px;
        height: 64px;
        border: 1px solid #0081dc;
        border-radius: 32px;
        padding-left: 30px;
        box-sizing: border-box;
        font-size: 28px;
      }

      .send-btn {
        width: 96px;
        height: 64px;
        border: none;
        outline: none;
        border-radius: 6px;
        background: #0081dc;
        color: #ffffff;
        font-size: 30px;

        &:active {
          background: #0868ad;
        }
      }
    }
  }
}
</style>
