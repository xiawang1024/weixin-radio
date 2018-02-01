import router from '@/router'
import store from '@/store'
import axios from 'axios'
import Qs from 'qs'
const wx = require('weixin-js-sdk')

const HNDTHOST = 'http://program.hndt.com'

const [
    DEFAULT_TITLE,
    DEFAULT_LINK,
    DEFAULT_IMGURL,
    DEFAULT_DESC
] = [
    '河南广播',
    'http://www.hndt.com/player/wap/index.html',
    'http://hndt.com/res/logo_300.png',
    '河南广播网是河南广播电视台广播业务领域的官方网站。聚合了河南广播电视台10套广播频率、 14 套网络广播、 河南18个省辖市及各县市100多套广播频率资源，“听河南，览天下”'
]


let configData = {
    url: window.location.href.split('#')[0],
    jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'chooseImage',
        'startRecord', 
        'playVoice', 
        'stopRecord', 
        'downloadVoice',
        'uploadVoice',
        'stopVoice'
    ]
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
    let storeShareConf = null;
    let shareConf = null;   
    let isChannel = to.name == 'channel'  
    
    setTimeout(() => {
        storeShareConf = store.state.shareConf   
        shareConf = initShareConf(isChannel, storeShareConf,to)  
        wxReady(shareConf)   
        console.log(shareConf)
    },600)
    
    
    next()
})

function initShareConf (isChannel, storeShareConf, to) { 
    let currentTitle = isChannel ? DEFAULT_TITLE : `${storeShareConf && storeShareConf.name}`
    let currentLink = isChannel ? DEFAULT_LINK : `${configData.url}#${to.fullPath}`
    let currentImg = isChannel ? DEFAULT_IMGURL : `${HNDTHOST}${storeShareConf && storeShareConf.image}`
    let currentDesc = isChannel ? DEFAULT_DESC : `${storeShareConf && storeShareConf.description}`
    return {
        currentLink,
        currentTitle,
        currentImg,
        currentDesc
    }  
}

function wxReady(shareConf) {
    wx.ready(function() {
        wx.onMenuShareTimeline({
        title: shareConf.currentTitle, 
        link: shareConf.currentLink, 
        imgUrl: shareConf.currentImg, 
        success: function() {
            
        },
        cancel: function() {
            
        }
        });
        wx.onMenuShareAppMessage({
            title: shareConf.currentTitle,
            link: shareConf.currentLink, 
            imgUrl: shareConf.currentImg, 
            desc: shareConf.currentDesc, 
            type: '', 
            dataUrl: '', 
            success: function() {
                
            },
            cancel: function() {
                
            }
        });
    })
}



