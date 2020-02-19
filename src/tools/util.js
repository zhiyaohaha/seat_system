const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 时间格式处理函数
/*
* number:时间锉
* format(string):时间格式 'Y-M-D h:m:s'
* */
export function formatTime(number, format) {
  let formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  let returnArr = []
  let date
  if (Number(number) != number) {
    date = new Date(number.replace(/-/g, '/'))
  } else {
    date = new Date(number)
  }

  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))
  for (let i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}

// 检查值是否存在
export function examineValue(value) {
  let strValue = JSON.stringify(value)
  if (!!strValue && strValue !== '' && strValue !== 'false' && strValue !== 'null' && strValue !== 'undefined' && strValue !== '{}' && strValue !== '[]') {
    return true
  }
  return false
}

