import Vue from 'vue'

Vue.filter('timeStamp2LocalTime',function(val) {
    return getLocalTime(val)
})

function getLocalTime(nS) {     
    return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');     
} 