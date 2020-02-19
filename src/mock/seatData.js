let Mock = require('mockjs')
let floor1 = Mock.mock({
  'desk|16': [{
    'code|+1': 1,
    'seat|4':[
      {
        'seatCode|+1':101,
        'flag|1-2':true,
        'startTime'(){
          return new Date(Mock.mock('@now(hour)')).getTime()
        },
        'endTime':function () {
          return this.startTime + 3600000*4
        }
      }
    ]
  }]
})
let floor2 = Mock.mock({
  'desk|16': [{
    'code|+1': 1,
    'seat|4':[
      {
        'seatCode|+1':201,
        'flag|1-2':true
      }
    ]
  }]
})
let floor3 = Mock.mock({
  'desk|16': [{
    'code|+1': 1,
    'seat|4':[
      {
        'seatCode|+1':301,
        'flag|1-2':true
      }
    ]
  }]
})
let floor4 = Mock.mock({
  'desk|16': [{
    'code|+1': 1,
    'seat|4':[
      {
        'seatCode|+1':401,
        'flag|1-2':true,
        'startTime':''
      }
    ]
  }]
})
Mock.mock("/seatData", "post", (options) => {
  options = JSON.parse(options.body)
  let data = {}
  if (options.id === 1) {
    data.floor = floor1
  } else if (options.id === 2) {
    data.floor = floor2
  } else if (options.id === 3) {
    data.floor = floor3
  } else if (options.id === 4) {
    data.floor = floor4
  }
  return data
})
