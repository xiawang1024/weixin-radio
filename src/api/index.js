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
export {
	getLiveItem,
	getClassItem,
	getChannelItem,
	clickItem
}