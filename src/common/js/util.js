
/**
 * 添加前置0
 * @param {Number} num 
 * @param {Number} n 不足n位的添加0
 */
export function _pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
}

/**
 * 获取today 
 * 返回格式： 2018-03-15
 */
export function getToday() {
  let time = new Date()
  let year = time.getFullYear()
  let month = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1): time.getMonth() + 1;
  let day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  let dateStr = year + "-" + month + "-" + day;
  return dateStr
}

/**
 * 日期格式转时间戳
 * 日期格式2015-03-05 00:00:00.0
 * 返回时间戳
 */
export function toTimeStamp(date) {
  // var date = '2015-03-05 00:00:00.0';
  date = date.substring(0,19);
  date = date.replace(/-/g,'/');
  var timestamp = new Date(date).getTime();
  return timestamp/1000;
}

/**
 * 时间戳转日期格式
 * 返回格式 2018-03-15
 */
export function timeStampToDate(nS) {
  let time = null
  if(nS) {
    time = new Date(parseInt(nS*1000))
  }else {
    time = new Date()
  }
  let year = time.getFullYear()
  let month = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1): time.getMonth() + 1;
  let day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  let dateStr = `${year}-${month}-${day}`;
  let h = time.getHours() ;
  let m = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  let s = time.getSeconds();
  return dateStr
  
}