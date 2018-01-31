import router from '@/router'
import axios from 'axios'
import Qs from 'qs'
var wx = require('weixin-js-sdk')

const TITLE = '河南广播'
const DEFAULT_LINK = 'http://www.hndt.com/player/wap/index.html'
const DEFAULT_IMGURL = 'http://hndt.com/res/logo_300.png'
const DESC = '河南广播网是河南广播电视台广播业务领域的官方网站。聚合了河南广播电视台10套广播频率、 14 套网络广播、 河南18个省辖市及各县市100多套广播频率资源，“听河南，览天下”'

let configData = {
    url: window.location.href.split('#')[0],
    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','chooseImage', 'startRecord', 'playVoice', 'stopRecord', 'downloadVoice', 'uploadVoice', 'stopVoice']
}

axios.post('https://a.weixin.hndt.com/at/sign',Qs.stringify({url:configData.url})).then((res) => {
    let data = res.data
    wx.config({
        debug: false, 
        appId: data.appId, 
        timestamp: data.timestamp,
        nonceStr: data.nonceStr, 
        signature: data.signature,
        jsApiList: configData.jsApiList
    });
})

router.beforeEach((to, from, next) => {    
    let currentLink = `${configData.url}#${to.fullPath}`
    wx.ready(function() {
        wx.onMenuShareTimeline({
        title: TITLE, 
        link: currentLink, 
        imgUrl: DEFAULT_IMGURL, 
        success: function() {
            
        },
        cancel: function() {
            
        }
        });
        wx.onMenuShareAppMessage({
            title: TITLE,
            desc: DESC, 
            link: currentLink, 
            imgUrl: DEFAULT_IMGURL, 
            type: '', 
            dataUrl: '', 
            success: function() {
                
            },
            cancel: function() {
                
            }
        });
    })
    next()
})



