export function isPc() {
  if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
    return 'phone'
  } else {
    return 'pc'
  }
}
