export default function audioAutoPlay(id){  
    let audio = document.getElementById(id),  
        play = function(){  
            audio.play();  
            document.removeEventListener("touchstart",play, false);  
        };  
    audio.play();  
    document.addEventListener("WeixinJSBridgeReady", function () {  
        play();  
    }, false);  
    document.addEventListener('YixinJSBridgeReady', function() {  
        play();  
    }, false);  
    document.addEventListener("touchstart",play, false);  
}  
 
