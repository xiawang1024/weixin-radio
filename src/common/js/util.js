
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