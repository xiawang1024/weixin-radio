<template>
  <div class="items">
    <div class="hd">
      <!-- <router-link to="/channel" tag='span' class="icon-back back"></router-link> -->
      <span class="icon-back back" @click="goToChannel"></span>
      <img src="./logo.png" alt class="img">
      <load class="load"></load>
    </div>
    <div class="audio-wrap">
      <div class="item-logo" v-if="itemsInfo">
        <img
          :src="'http://program.hndt.com' + itemsInfo.image"
          class="img"
          :class="playOrPause ? '' : 'isPause' "
        >
        <span :class=" playOrPause ? 'icon-pause' : 'icon-play'" @click="playSwitch"></span>
      </div>
      <div class="item-info" v-if="itemsInfo">
        <span class="icon-tv" @click="goToLive">TV</span>
        <p class="name" id="channel_name">{{itemsInfo.name}}</p>
        <p class="live-name">
          <i class="icon-LIVE" v-show="isLivePlay"></i>
          <span class="playback" v-show="!isLivePlay">回听</span>
          {{isLivePlay ? itemsInfo.live : playBackTitle}}
        </p>
        <p class="live-time" v-show="isLivePlay">
          <span>{{itemsInfo.time}}</span>
        </p>
        <p class="live-time progress-wrap" v-show="!isLivePlay">
          <span class="time time-l">{{formatPlayTime(currentTime)}}</span>
          <span class="progress">
            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
          </span>
          <span class="tiem time-r">{{formatPlayTime(duration)}}</span>
        </p>
      </div>
    </div>
    <div class="tab-item">
      <div class="item" :class="{'z-crt':tabIndex == 0}" @click="tabSwitch(0)">
        <i class="icon-back-listen"></i>
        <span>回听</span>
      </div>
      <div class="item" :class="{'z-crt':tabIndex == 1}" @click="tabSwitch(1)">
        <i class="icon-comment"></i>
        <span>互动</span>
      </div>
    </div>
    <div class="itemsList" v-show="tabIndex == 0">
      <!-- <div class="title">回听</div> -->
      <keep-alive>
        <date-pick @clickItem="getDatePrograms"></date-pick>
      </keep-alive>
      <scroll class="list-wrap" :data="itemsList" ref="listview">
        <div>
          <div class="list" v-for="(item, index) in itemsList" ref="list">
            <span class="item time">{{format(item.beginTime)}} - {{format(item.endTime)}}</span>
            <span class="item name">{{item.title}}</span>
            <span class="item isPlay" @click="playBackSrc(item,index)">
              <i v-show="index === isPlayIndex && isToDay" class="icon-LIVE"></i>
              <span
                v-show="item.playUrl && item.playUrl.length > 0 && index !== isPlayIndex"
                class="playback"
              >回听</span>
            </span>
          </div>
        </div>
      </scroll>
    </div>
    <comment-list ref="child" :cid="itemsInfo && itemsInfo.cid" v-show="tabIndex == 1"></comment-list>
    <div class="netRadioDesc" v-show="itemsList.length==0">
      <div class="desc-wrap" v-if="itemsInfo">{{itemsInfo.description}}</div>
    </div>
    <toast :msg="msg" :isShowToast="isShowToast"></toast>
  </div>
</template>

<script>
// const Hls = r => require.ensure([], () => r(require('hls'))) //如果是电脑端，则加载hls，否则不加载
// import Hls from 'hls'
import Scroll from "@/base/scroll";
import DatePick from "@/base/datePick";
import ProgressBar from "@/base/progress-bar";
import Load from "@/components/load/load";
import Toast from "@/base/toast";
import CommentList from "@/base/comment-list";

import { getChannelItem, clickItem, getCommentList } from "api/index";
import { addClass } from "common/js/dom.js";
import { isPc } from "common/js/isPc.js"; //判断是否是电脑端

const IMGURL = "http://hndt.com/res/logo_300.png";
const DESC =
  "河南广播网是河南广播电视台广播业务领域的官方网站。聚合了河南广播电视台10套广播频率、 14 套网络广播、 河南18个省辖市及各县市100多套广播频率资源。“听河南，览天下”";
const PREFIX = "http://program.hndt.com";
export default {
  name: "items",
  components: {
    Scroll,
    Load,
    DatePick,
    ProgressBar,
    Toast,
    CommentList
  },
  data() {
    return {
      itemsInfo: null, //频率信息
      itemsList: [], //频率programs
      isPlayIndex: null, //直播index
      playOrPause: true, //播放暂停按钮
      isToDay: true, //是否是今天 ，是true，否false
      isLivePlay: true, //是否是直播
      liveStream: null, //直播流
      playBackTitle: "", //回听栏目title
      percent: 0, //播放百分比
      currentTime: 0, //当前播放时间
      duration: 0, //播放总时间
      msg: "", //toast提示
      isShowToast: false, //是否显示toast
      tabIndex: 0 //tab切换index
    };
  },
  created() {
    this.parseQuery();
  },
  mounted() {
    this.audio = document.getElementById("audio");
    if (this.audio.readyState == 4) {
      if (this.audio.paused) {
        this.playOrPause = false;
      } else {
        this.playOrPause = true;
      }
    }
    this.watchPlayPercent();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.href = window.location.href.split("#")[0] + "#" + to.fullPath;
      console.log(vm.href);
    });
  },
  methods: {
    _share() {
      //频率页面分享
      wx.ready(() => {
        wx.onMenuShareTimeline({
          title: this.itemsInfo.name, // 分享标题
          link: this.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: PREFIX + this.itemsInfo.image, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareAppMessage({
          title: this.itemsInfo.name, // 分享标题
          desc: this.itemsInfo.description, // 分享描述
          link: this.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: PREFIX + this.itemsInfo.image, // 分享图标
          type: "", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
      });
    },
    _getChannelItem(cid) {
      let todayStamp = this._timeToStamp(this._getToDay());
      clickItem(cid, todayStamp).then(res => {
        let data = res.data;
        this.itemsInfo = data;
        this.itemsList = data.programs;
        if (data.cid == 120) {
          this.liveStream =
            "http://stream.hndt.com:1935/live2/1061_aac/playlist.m3u8";
        } else {
          this.liveStream = data.streams[0];
        }

        if (!this.audio.getAttribute("src")) {
          this._playSrc(this.liveStream);
        }
        this.$nextTick(() => {
          this._isPlay(data.programs);
          this._share();
        });
      });
    },
    _isPlay(programs) {
      let currentTime = (new Date().getTime() / 1000) | 0; //当前时间时间戳
      for (let i = 0; i < programs.length; i++) {
        var item = programs[i];
        if (currentTime <= item.endTime && currentTime >= item.beginTime) {
          this.isPlayIndex = i;
          setTimeout(() => {
            this._scrollTo(this.isPlayIndex);
          }, 600);
          return;
        }
      }
    },
    _scrollTo(index) {
      let listHeight = parseInt(this.$refs.list[0].clientHeight); //单行高
      let len = this.itemsList.length; //行数
      let ContainHeight = this.$refs.listview.$el.clientHeight; //滚动区域高度
      let offsetY = listHeight * index; //需要滚动的高度
      let maxOffsetY = listHeight * len - ContainHeight; //最大滚动的高度

      let scrollY = Math.min(maxOffsetY, offsetY);
      if (scrollY < 0) {
        scrollY = 0;
      }
      this.$refs.listview.scroll &&
        this.$refs.listview.scroll.scrollTo(0, -scrollY, 1000);
    },
    _scrollTop() {
      this.$refs.listview.scroll &&
        this.$refs.listview.scroll.scrollTo(0, 0, 1000);
    },
    _playSrc(stream) {
      // console.log(stream)
      if (this._isPc() && this._isM3u8(stream)) {
        this._playHlsSrc(stream);
      } else {
        this.audio.setAttribute("src", stream);
      }
    },
    playSwitch() {
      if (this.playOrPause) {
        this.playOrPause = false;
        this.audio.pause();
      } else {
        this.playOrPause = true;
        this.audio.play();
      }
    },
    parseQuery() {
      let query = this.$route.query;
      let cid = query.cid;
      this.cid = cid;
      if (cid) {
        this._getChannelItem(cid);
      }
    },
    goToChannel() {
      this.$router.push({ path: "/channel", query: { isPlayIndex: this.cid } });
    },
    format(interval) {
      let val = parseInt(interval) * 1000;
      let time = new Date(val);
      const hour = this._pad(time.getHours());
      const min = this._pad(time.getMinutes());
      return `${hour}:${min}`;
    },
    formatPlayTime(interval) {
      interval = interval | 0;
      const minute = this._pad((interval / 60) | 0);
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    //点播列表
    getDatePrograms(date) {
      let cid = this.cid;
      let year = new Date().getFullYear();
      let month = this._pad(new Date().getMonth() + 1);
      let day = this._pad(new Date().getDate());
      let time = year + "-" + date.date + " 00:00:00.0";
      let stamp = this._timeToStamp(time);
      let nowDate = month + "-" + day;
      if (nowDate == date.date) {
        // 如果点击的是今天，那么跳动到直播
        this.isToDay = true;
      } else {
        this.isToDay = false;
      }
      this._getItems(this.cid, stamp, !this.isToDay);
    },
    playBackSrc(item, index) {
      let playUrl = item.playUrl;
      if (index == this.isPlayIndex) {
        // 如果相等，则是直播，否则是点播
        this.isLivePlay = true;
        this._playSrc(this.liveStream);
      } else {
        this.isLivePlay = false;
        if (!playUrl) {
          return;
        } else {
          if (playUrl.length == 0) {
            return;
          } else {
            //回听
            this.playBackTitle = item.title;
            this._playSrc(playUrl[0]);
          }
        }
      }
    },
    _getToDay() {
      let year = new Date().getFullYear();
      let month = this._pad(new Date().getMonth() + 1);
      let day = this._pad(new Date().getDate());
      let today = `${year}-${month}-${day} 00:00:00.0`;
      return today;
    },
    //时间转时间戳
    _timeToStamp(date) {
      // var date = '2015-03-05 00:00:00.0';
      date = date.substring(0, 19);
      date = date.replace(/-/g, "/");
      var timestamp = new Date(date).getTime();
      return timestamp / 1000;
    },
    _getItems(cid, time, isScrollTop) {
      clickItem(cid, time).then(res => {
        let data = res.data;
        this.itemsList = data.programs;
        if (isScrollTop) {
          this._scrollTop();
        } else {
          this._scrollTo(this.isPlayIndex);
        }
      });
    },
    //监听播放信息
    watchPlayPercent() {
      this.audio.addEventListener("timeupdate", e => {
        const currentTime = e.target.currentTime;
        const duration = e.target.duration;
        this.currentTime = currentTime;
        this.duration = duration;
        this.percent = currentTime / duration;
      });
    },
    onProgressBarChange(percent) {
      const currentTime = this.audio.duration * percent;
      this.audio.currentTime = currentTime;
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
            this.hls.attachMedia(this.audio);
            this.hls.on(Hls.Events.MANIFEST_PARSED, function() {
              this.audio.play();
            });
          }
        });
      }
    },
    //tab切换 回听/互动
    tabSwitch(index) {
      var arr = [119, 117, 120];
      if (index == 1) {
        if (arr.indexOf(parseInt(this.itemsInfo.cid)) != -1) {
          this.tabIndex = index;
          this.$nextTick(() => {
            this.$refs.child.refresh();
          });
        } else {
          this._toast("评论未开通！");
        }
      } else {
        this.tabIndex = index;
      }
    },
    goToLive() {
      // this._toast('视频功能暂未开放！')
      //暂不开放视频直播页面
      this.$router.push({ path: "/live", query: { cid: this.cid } });
    },
    _toast(msg) {
      this.msg = msg;
      this.isShowToast = true;
      setTimeout(() => {
        this.isShowToast = false;
      }, 3000);
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin.styl';

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.toast {
  width: 200px;
  height: 60px;
  background: #f0f;
}

.items {
  width: 100%;
  background: #fff;

  .hd {
    position: relative;
    width: 100%;
    height: $items-hd-height;
    line-height: $items-hd-height;
    text-align: center;
    border-1px($color);
    font-size: 0;

    .img {
      vertical-align: middle;
      width: 300px;
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
      top: 30px;
      right: 30px;
    }
  }

  .audio-wrap {
    width: 100%;
    height: $items-audio-height;
    display: flex;
    align-items: center;
    border-1px($color);

    .item-logo {
      flex: 2;
      text-align: center;
      position: relative;
      font-size: 0;

      .img {
        width: 240px;
        height: 240px;
        border-radius: 50%;
        border: 2px solid $color;
        animation: rotate 6s linear infinite;

        &.isPause {
          animation-play-state: paused;
        }
      }

      .icon-play, .icon-pause {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 120px;
        color: #1ba2ff;
        opacity: 0.8;
      }
    }

    .item-info {
      position: relative;
      flex: 3;
      text-align: left;

      .icon-tv {
        position: absolute;
        top: 10px;
        right: 20px;
        display: inline-block;
        padding: 4px 10px;
        border: 2px solid #0081dc;
        border-radius: 4px;
        color: #0081dc;

        &:before {
          content: '';
          position: absolute;
          top: -16px;
          left: -16px;
          right: -16px;
          bottom: -16px;
        }
      }

      p {
        line-height: 2;

        &.name {
          font-size: 40px;
        }

        &.live-name {
          font-size: 36px;
          height: 84px;
          color: #666;
          no-wrap();
          max-width: 440px; // 最大宽度450px

          .icon-LIVE {
            font-size: 84px;
            vertical-align: middle;
          }

          .playback {
            vertical-align: middle;
            padding: 6px 10px;
            background: #888;
            color: #fff;
            font-size: 24px;
            border-radius: 6px;
          }
        }

        &.live-time {
          font-size: 36px;
          color: #999;
        }

        &.progress-wrap {
          position: relative;
          height: 72px;
          width: 400px;

          .time-l {
            position: absolute;
            left: -12px;
            top: 24px;
            font-size: 24px;
          }

          .time-r {
            position: absolute;
            right: -24px;
            top: 24px;
            font-size: 24px;
          }
        }
      }
    }
  }

  .tab-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: $items-items-title;
    border-1px($color);
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 28px;
    font-weight: 500;

    .item {
      padding: 20px;
      color: #333333;

      &.z-crt {
        color: #0081dc;
      }

      i {
        font-size: 38px;
        vertical-align: middle;
        margin-right: 2px;
      }

      span {
        vertical-align: middle;
      }
    }
  }

  .itemsList {
    width: 100%;
    overflow: hidden;

    .title {
      width: 100%;
      height: $items-items-title;
      line-height: $items-items-title;
      padding-left: 30px;
      font-size: 30px;
      font-weight: 700;
      border-1px($color);
      box-sizing: border-box;
    }

    .list-wrap {
      position: fixed;
      top: $items-list-wrap-top;
      width: 100%;
      background: #fff;
      bottom: 0;
      width: 100%;
      overflow: hidden;

      .list {
        display: flex;
        height: $items-item-list;
        line-height: $items-item-list;
        border-1px($color);
        box-sizing: border-box;
        font-size: 32px;

        .time {
          flex: 2;
          text-align: center;
          color: #333;
        }

        .name {
          flex: 3;
          text-align: center;
          no-wrap();
        }

        .isPlay {
          flex: 1;
          text-align: center;

          .icon-LIVE {
            font-size: 100px;
          }

          .playback {
            padding: 6px 10px;
            background: #888;
            color: #fff;
            font-size: 26px;
            border-radius: 6px;
          }
        }
      }
    }
  }

  .netRadioDesc {
    width: 100%;
    position: fixed;
    top: $items-netRadioDesc-top;
    bottom: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background: #fff;

    .desc-wrap {
      width: 100%;
      padding: 60px 100px;
      box-sizing: border-box;
      line-height: 2;
      letter-spacing: 2px;
      font-size: 34px;
      text-align: center;
    }
  }
}
</style>
