import {formatTime} from '../tools/util'

let Mock = require('mockjs')
let startTime = function () {
  let dateNow = formatTime(Date.now(),'M')
  let dateNowDay = formatTime(Date.now(),'D')
  let randomNumD = Math.round(Math.random() *7)
  let randomNumH = Math.round(Math.random() *13)+8
  return new Date(Mock.mock(`@datetime(2020-${dateNow}-${dateNowDay*1 + randomNumD} ${0+randomNumH}:00)`)).getTime()
}
let endTime = function () {
  let randomNum = Math.round(Math.random() *4) + 1
  return this.startTime + 3600000 * randomNum
}
export let floor1 = Mock.mock({
  'desk|16': [{
    'code|+1': 1,
    'seat|4': [
      {
        'seatCode|+1': 101,
        userArr:[],
        flag:false
      }
    ]
  }]
})
export let floor2 = Mock.mock({
  'desk|16': [{
    'code|+1': 1,
    'seat|4': [
      {
        'seatCode|+1': 201,
        userArr:[],
        flag:false
      }
    ]
  }]
})
export  let floor3 = Mock.mock({
  'desk|16': [{
    'code|+1': 1,
    'seat|4': [
      {
        'seatCode|+1': 301,
        userArr:[],
        flag:false
      }
    ]
  }]
})
export let floor4 = Mock.mock({
  'desk|16': [{
    'code|+1': 1,
    'seat|4': [
      {
        'seatCode|+1': 401,
        userArr:[],
        flag:false
      }
    ]
  }]
})
