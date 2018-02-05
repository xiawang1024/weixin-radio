function adustFontSize() {
	let isAndroid = (/android/gi).test(window.navigator.appVersion)
	let dpr = window.devicePixelRatio
	console.log(isAndroid)
	if(isAndroid) {
		
		return {
			background:'rgba(0,0,0,0.75)',
			color:'#ffffff',
			fontSize:'16px',
			textAlign:'center',
			lineHeight:'1.8125'
		}
		
	}else{
		return {
			background:'rgba(0,0,0,0.75)',
			color:'#ffffff',
			fontSize:'0.38rem',
			textAlign:'center',
			lineHeight:'1.8125'
		}
	}
}
const dialogConf = adustFontSize()
export default dialogConf