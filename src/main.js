// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import axios from 'axios'
import Qs from 'qs'
import filter from './filter/index'
import "@/common/js/flexible.js"
import '@/common/stylus/index.styl'

fastclick.attach(document.body)


var TITLE = '河南广播'
var LINK = 'http://www.hndt.com/player/wap/index.html'
var IMGURL = 'http://hndt.com/res/logo_300.png'
var DESC = '河南广播网是河南广播电视台广播业务领域的官方网站。聚合了河南广播电视台10套广播频率、 14 套网络广播、 河南18个省辖市及各县市100多套广播频率资源。“听河南，览天下”'
Vue.config.productionTip = false
router.beforeEach((to,from,next) => {
  let href = window.location.href.split('#')[0] + '#' + to.fullPath
  axios.post('https://a.weixin.hndt.com/at/sign',Qs.stringify({url:href})).then((res) => {
    let data = res.data
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名，见附录1
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
  })
  //如何是首页，分享默认连接
  if(to.name == 'channel') {
    wx.ready(function() {
      wx.onMenuShareTimeline({
        title: TITLE, // 分享标题
        link: LINK, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: IMGURL, // 分享图标
        success: function() {
            // 用户确认分享后执行的回调函数
        },
        cancel: function() {
            // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareAppMessage({
          title: TITLE, // 分享标题
          desc: DESC, // 分享描述
          link: LINK, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: IMGURL, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
              // 用户确认分享后执行的回调函数
          },
          cancel: function() {
              // 用户取消分享后执行的回调函数
          }
      });
    })
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  filter,
  template: '<App/>',
  components: { App }
})
