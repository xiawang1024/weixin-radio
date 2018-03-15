import axios from 'axios'
axios.defaults.baseURL = 'http://program.hndt.com'

/**
 * 全部直播列表
 * @return {[type]} [description]
 */
const getLiveItem = () => axios.get('/get/live')
/**
 * 获取指定频率类别列表接口
 * @param  {[type]} classId [1：河南电台，2：网络电台；3：地市台]
 * @return {[type]}         [description]
 */
const getClassItem = (classId) => axios.get('/get/live/class/' + classId)
/**
 * 获取指定频率列表接口
 * @param  {[type]} channelId [cid]
 * @return {[type]}           [description]
 */
const getChannelItem = (channelId) => axios.get('/get/live/channel/' + channelId)
/**
 * 点播接口
 * @param  {[type]} channelId [频率id]
 * @param  {[type]} time      [时间戳]
 * @return {[type]}           [description]
 */
const clickItem = (channelId,time) => axios.get('/get/vod/' + channelId + '/' + time)

const getCommentList = (id,toId=-1,page=1) => axios.get('http://talk.hndt.com/hngbWeb/api/comment/showCommentforPage.do?',{
	params:{
		id,
		toId,
		page
	}
})

// 央广音频源

import jsonp from 'common/js/jsonp.js'

// 直播
const getChinaLive = (date) => {
	let url = 'http://tacc.radio.cn/pcpages/radiopages'
	let data = {
		place_id:3225,
		date:date,
		_:1520582584099
	}
	return jsonp(url,data)
}

export {
	getLiveItem,
	getClassItem,
	getChannelItem,
	clickItem,
	getCommentList,
	getChinaLive
}