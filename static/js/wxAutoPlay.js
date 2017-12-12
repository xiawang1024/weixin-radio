window.onload = function() {
    
    wx.ready(function() {
        // 微信端audio自动播放
        (function audioAutoPlay() {
            var audio = document.getElementById('audio');
            audio.play();
            document.addEventListener("WeixinJSBridgeReady", function() {
                audio.play();
            }, false);
        })();
    });

}