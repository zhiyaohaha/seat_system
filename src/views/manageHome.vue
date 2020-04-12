<template>
  <div class="manage_home">
    <el-card class="box_card" shadow="always">
      <el-row class="time_select" align="middle">
        <el-col :span="2">
          <div>时间</div>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            @change="timeSelect"
            v-model="dateValue"
            align="left"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="8" :push="8">
          <el-button @click="leaveWord" type="primary">留言板</el-button>
          <el-button @click="statistics" type="primary">统计</el-button>
          <el-button @click="quit" type="primary">退出</el-button>
        </el-col>
      </el-row>
      <el-row class="floor" align="middle">
        <el-col :span="2">
          <div>楼层</div>
        </el-col>
        <el-col :span="2" v-for="item in 4" :key="item">
          <el-button type="primary" @click="seatDataPost(item)">{{item}}F</el-button>
        </el-col>
        <el-col :span="8" v-if="amount">
          {{this.floor}}F总计:64个座位 已预约:{{amount}}个座位
        </el-col>
      </el-row>
      <el-card class="seat" :body-style="{display:'flex',
        'flex-wrap':'wrap',
        'justify-content':'space-between',
        'padding': '0 20px',
        'align-content': 'space-between'
        }"
               shadow="always">
        <el-card class="desk clear" shadow="always" v-for="(item) in seatData" :key="item.code"
                 :body-style="{
            position:'relative',
            width:'205px',
            height:'118px',
            'box-sizing':'border-box'
          }">
          <template v-for="(it, ind) in item.seat">
            <div class="desk_seat" :key="it.seatCode" @click="deskSeatSelect(it)" :class="{top_left:ind===0,
            top_right:ind===1,
            bottom_left:ind===2,
            bottom_right:ind===3}">
              <i class="el-icon-user-solid" :class="{iconColor:it.flag}"></i>
              <div>{{it.seatCode}}</div>
            </div>
          </template>
          <div class="desk_content"></div>
        </el-card>
      </el-card>
    </el-card>
    <transition name="fade">
      <div v-show="drawer" class="drawer" @click.self="handleClose">
        <el-card shadow="always" class="drawer_content">
          <div class="title">预约信息</div>
          <div class="makeAnAppointment">
            <div v-if="userSeatData&&userSeatData.length&&item.seatCode === selectCode" class="makeItem"
                 v-for="(item, index) in userSeatData"
                 :key="index">
              <div class="">
                用户名:{{item.userName}}
              </div>
              <div class="">
                楼层:{{item.floor}}F
              </div>
              <div class="">
                座位:{{item.seatCode}}
              </div>
              <div class="">
                时间:{{item.startTime + '到' + item.endTime}}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </transition>
    <el-drawer
      title="我是标题"
      :visible.sync="leaveWordIsShow"
      direction="rtl"
      :show-close="false"
      :with-header="false"
      class="message_board"
    >
      <div class="title">留言板</div>
      <div class="message_content">
        <div class="message_item" v-for="(item,index) in leaveWordContent" :key="index">
          <div class="userName">
            用户名:{{item.userName}}
          </div>
          <div class="time">
            时间:{{formatTime(item.time,'Y-M-D h:m:s')}}
          </div>
          <div>
            留言内容:
          </div>
          <div class="content">
            {{item.content}}
          </div>
        </div>
      </div>
    </el-drawer>
    <el-dialog title="座位使用率统计表" :visible.sync="statisticsIsShow" :fullscreen="true">
      <el-row align="middle">
        <el-col :span="6">
          <el-date-picker
            @change="messageMonthChange"
            v-model="messageMonth"
            align="left"
            type="month"
            placeholder="选择月份"
            :picker-options="messageMonthOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-select @change="messageDayChange" clearable
                     :disabled="!messageMonth" v-model="messageDay" placeholder="请选择天">
            <el-option
              v-for="item in DayOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row align="middle" style="margin-top: 10px">
        <el-col :span="6">
          <el-time-select
            @change="messageTimeSelect('timeValue1')"
            v-model="timeValue1"
            :disabled="!(messageDay+'')"
            :picker-options="{
                start: '08:00',
                step: '1:00',
                end: '21:00'
              }"
            placeholder="开始时间">
          </el-time-select>
        </el-col>
        <el-col :span="6">
          <el-time-select
            :disabled="!timeValue1"
            @change="messageTimeSelect"
            v-model="timeValue2"
            :picker-options="{
                start: '08:00',
                step: '1:00',
                end: '21:00',
                minTime: timeValue1
              }"
            placeholder="结束时间">
          </el-time-select>
        </el-col>
        <el-col :span="6">
          <el-button @click="timeQuantum" :disabled="!timeValue2" type="primary">时间段使用率查询</el-button>
        </el-col>

      </el-row>
      <el-table :data="gridData" :key="reflush" height="500">
        <el-table-column property="seatCode" label="座位号" width="150"></el-table-column>
        <el-table-column property="floor" label="所在楼层" width="200"></el-table-column>
        <el-table-column property="usageRate" label="使用率"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="图书馆时间段座位使用率报告" :visible.sync="reportIsShow">
      <div>{{monthDay}}{{timeValue1+'-'+timeValue2}}
      <div>座位使用率为{{usageRateCount}}</div>
      <div>1F使用率{{usageRateF1}}</div>
      <div>2F使用率{{usageRateF2}}</div>
      <div>3F使用率{{usageRateF3}}</div>
      <div>4F使用率{{usageRateF4}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import logIn from '../components/logIn'
  import myInfo from './myInfo'
  import {formatTime, toPercent} from '../tools/util'
  import db from '../db'

  export default {
    name: 'manage_home',
    data() {
      return {
        dateValue: '', // 天
        pickerOptions: {
          disabledDate(time) {
            let mondayTime = Date.now() + 6 * 24 * 60 * 60 * 1000
            let today = Date.now() - 24 * 60 * 60 * 1000
            return time.getTime() < today || time.getTime() > mondayTime;
          }
        },
        messageMonthOptions: {
          disabledDate(time) {
            let mondayTime = Date.now() + 6 * 24 * 60 * 60 * 1000
            let today = new Date('2020-1-1').getTime()
            return time.getTime() < today || time.getTime() > mondayTime;
          }
        },
        reportIsShow: false,// 开始
        messageMonth: '', // 统计月份
        messageDay: '', // 统计天
        monthDay: '', // 天
        monthLength: '', // 月份长度
        timeValue1: '', // 统计 开始时间
        timeValue2: '', // 统计 结束时间
        /*floorValue: '', // 统计 楼层*/
        reflush: '', // 表格刷新
        statisticsArr: [], // 全部的使用时间
        /*floorOptions: [
          {
            value: '0',
            label: '全部'
          },
          {
            value: '1',
            label: '1F'
          },
          {
            value: '2',
            label: '2F'
          },
          {
            value: '3',
            label: '3F'
          },
          {
            value: '4',
            label: '4F'
          },
        ], // 统计 楼层列表*/
        usageRateCount: '', // 图书馆使用率
        usageRateF1: '',
        usageRateF2: '',
        usageRateF3: '',
        usageRateF4: '',
        DayOptions: [], // 统计 天列表
        arrUsageRate: [], // 统计 数据信息
        seatData: null, // 座位信息
        amount: 0,// 已预约座位
        floor: 1, // 以选择楼层
        appointmentDate: '', // 时间格式
        userSeatData: '', // 预约座位信息
        drawer: false, // 预约座位信息展示
        selectCode: '', // 选择的座位号
        leaveWordIsShow: false,
        leaveWordContent: [], // 留言列表
        statisticsIsShow: false, // 统计表显示
        gridData: [] // 座位使用率表格
      }
    },
    components: {
      logIn, myInfo
    },
    computed: {},
    created() {
      let userId = localStorage.getItem('userId')
      if (userId === '0') {
        this.$router.push({name: 'manageHome'})
      }
    },
    methods: {
      // 时间段统计率
      timeQuantum() {
        let startTime = new Date(this.monthDay + ' ' + this.timeValue1).getTime()
        let endTime = new Date(this.monthDay + ' ' + this.timeValue2).getTime()
        let atLastTime = new Date(this.monthDay + ' ' + '21:00:00').getTime()
        let count = 0
        let F1count = 0
        let F2count = 0
        let F3count = 0
        let F4count = 0
        this.statisticsArr.forEach((item) => {
          if (endTime <= item.startTime || item.endTime <= startTime) {

          }else {
            count++
            if (item.floor == 1) {
              F1count++
            }
            if (item.floor == 2) {
              F2count++
            }
            if (item.floor == 3) {
              F3count++
            }
            if (item.floor == 4) {
              F4count++
            }
          }
        })
        this.usageRateCount = toPercent(count / 256)
        this.usageRateF1 = toPercent(F1count / 64)
        this.usageRateF2 = toPercent(F2count / 64)
        this.usageRateF3 = toPercent(F3count / 64)
        this.usageRateF4 = toPercent(F4count / 64)
        this.reportIsShow = true
      },
      // 天选择
      messageDayChange(res) {
        let monthDay = ''
        if (res + '') {
          let day = res + 1
          let month = formatTime(new Date(this.messageMonth).getTime(), 'Y-M')
          monthDay = formatTime(new Date(month + '-' + day).getTime(), 'Y-M-D')
        }
        this.monthDay = monthDay
        this.usageRate({monthLength: this.monthLength, monthDay})
      },
      // 统计 时间段选择
      messageTimeSelect(res) {
        if(res === 'timeValue1'){
          this.timeValue2 = ''
        }
      },

      // 统计 月份选择
      messageMonthChange(res) {
        let month = formatTime(new Date(res).getTime(), 'D') * 1
        let monthLength = 30
        let smallMonth = [2, 4, 6, 9, 11]
        let toDay = formatTime(new Date().getTime(), 'D') * 1
        let arr = []
        if (!smallMonth.includes(month)) {
          monthLength = 31
        }
        for (let i = 0; i < monthLength; i++) {
          arr.push({
            value: i,
            label: i + 1 + '号'
          })
        }
        this.DayOptions = arr
        if (res + '' === 'null') {
          monthLength = ''
        }
        this.monthLength = monthLength
        this.usageRate({
          monthLength
        })
      },
      // 使用率计算
      usageRate({monthLength, monthDay}) {
        let dayTime = 46800000 // 一天的毫秒值
        let gridData = []
        if (this.gridData.length) {
          gridData = this.gridData
        }
        if (!!this.floorValue) { // 楼层

        } else if (!!this.timeValue2) { // 时间段

        } else if (!!this.monthDay) {// 天
          this.arrUsageRate.forEach((item, index) => {
            let timeDifference = 0
            item.days.forEach((it, ind) => {
              if (it.day === monthDay) {
                timeDifference += it.timeDifference
              }
            })
            if (timeDifference === 0) {
              gridData[index].usageRate = '0%'
            } else {
              gridData[index].usageRate = toPercent(timeDifference / dayTime)
            }
          })
        } else {// 月份
          let momthTime = dayTime * monthLength
          this.arrUsageRate.forEach((item, index) => {
            gridData[index] = {
              seatCode: item.seatCode,
              floor: item.floor,
              usageRate: '0%'
            }
            if (monthLength !== '') {
              if (item.timeDifference === 0) {
                gridData[index].usageRate = '0%'
              } else {
                gridData[index].usageRate = toPercent(item.timeDifference / momthTime)
              }
            } else {
              gridData = []
            }
          })
        }
        this.gridData = gridData
        this.reflush++
      },
      // 统计表
      statistics() {
        this.statisticsDataPost().then(() => {
          this.statisticsIsShow = true
        })
      },
      // 统计
      async statisticsDataPost() {
        let arr = []
        let arrUsageRate = []
        let employ = []
        let statisticsArr = []
        await db.tasks.toArray((res) => {
          arr = res
        })
        arr.forEach((item) => {
          item.seat.forEach((it) => {
            arrUsageRate.push({
              seatCode: it.seatCode,
              floor: item.floor,
              userArr: it.userArr,
              timeDifference: 0,
              days: []
            })
          })
        })
        arrUsageRate.forEach((item) => {
          if (item.userArr.length) {
            item.userArr.forEach((it) => {
              employ.push(it)
            })
          }
        })
        await db.user.where('userName').anyOf(employ).each((res) => {
          statisticsArr.push(...res.seat)
        })
        // this.gridData = arrUsageRate
        statisticsArr.forEach((item, index) => {
          arrUsageRate.forEach((it, ind) => {
            if (item.seatCode === it.seatCode) {
              it.timeDifference += item.endTime - item.startTime
              it.days.push({
                day: formatTime(item.startTime, 'Y-M-D'),
                timeDifference: it.timeDifference,
              })
            }
          })
        })
        this.statisticsArr = statisticsArr
        this.arrUsageRate = arrUsageRate
      },
      // 收集留言板信息
      async messageBoardAll() {
        await db.message.toArray((res) => {
          this.leaveWordContent = res
        })
      },
      handleClose() {
        this.drawer = false
      },
      // 退出
      quit() {
        localStorage.setItem('userName', '')
        localStorage.setItem('pass', '')
        localStorage.setItem('userId', '')
        this.$router.push('/')
      },
      // 留言板
      leaveWord() {
        this.leaveWordIsShow = true
        this.messageBoardAll()
      },
      // 获取座位数据
      async seatDataPost(id) {
        this.floor = id
        let seatData = []
        let that = this
        let amount = 0
        let userArr = []
        let userSeatArr = []
        let userSeatDataArr = []
        let userSeatData = []
        let startTime = new Date(that.appointmentDate).getTime()
        let endTime = new Date(that.appointmentDate).getTime() + 24 * 60 * 60 * 1000
        if (!this.appointmentDate) {
          return
        }
        await
          db.tasks.where('floor').anyOf([id]).each((res) => {
            seatData.push(res)
          })
        seatData.forEach((item) => {
          item.seat.forEach((it) => {
            if (it.userArr && it.userArr.length) {
              it.userArr.forEach((it1) => {
                userArr.push(it1)
              })
            }
          })
        })
        if (userArr && userArr.length) {
          await
            db.user.where('userName').anyOf(userArr).each((res) => {
              userSeatDataArr.push(res)
              userSeatArr.push({seat: res.seat})
            })
          userSeatArr.forEach((item) => {
            item.seat.forEach((it) => {
              seatData.forEach((seatItem) => {
                seatItem.seat.forEach((seatItemIt) => {
                  if (seatItemIt.seatCode === it.seatCode) {
                    if (startTime < it.endTime && endTime > it.startTime) {
                      if (startTime >= it.endTime || endTime <= it.startTime) {
                        seatItemIt.flag = false
                      } else {
                        seatItemIt.flag = true
                      }
                    }
                  }
                })
              })
            })
          })
        }
        seatData.forEach((item) => {
          item.seat.forEach((it) => {
            if (it.flag) {
              amount++
            }
          })
        })
        userSeatDataArr.forEach((item) => {
          item.seat.forEach((it) => {
            if (startTime < it.endTime && endTime > it.startTime) {
              userSeatData.push({
                floor: it.floor,
                seatCode: it.seatCode,
                startTime: formatTime(it.startTime, 'Y-M-D h:00:00'),
                endTime: formatTime(it.endTime, 'h:00:00'),
                userName: item.userName
              })
            }
          })
        })
        this.seatData = seatData
        this.amount = amount + ''
        this.userSeatData = userSeatData
      },
      // 时间选择
      timeSelect() {
        let appointmentDate = ''
        if (this.dateValue) {
          let selectDate = new Date(this.dateValue).getTime()
          appointmentDate = formatTime(selectDate, 'Y-M-D')
        }
        if (appointmentDate) {
          this.appointmentDate = appointmentDate
          this.seatDataPost(this.floor)
        }
      },
      // 座位选择
      deskSeatSelect(item) {
        if (item.flag) {
          this.selectCode = item.seatCode
          this.drawer = true
        }
      },
      //  时间筛选
      formatTime
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .manage_home
    .box_card
      height 94vh
      .time_select
        line-height 40px

      .floor
        margin-top 10px
        line-height 40px
        button
          height 40px
      .seat
        margin-top 20px
        height 530px
        .desk
          width 205px
          height 118px
          margin-top 10px

          .el-icon-user-solid
            color #34F11F
          .iconColor
            color red
          .desk_seat
            position absolute
            text-align center
            cursor pointer
          .top_left
            top 20px
            left 20px
          .top_right
            top 20px
            right 20px
          .bottom_left
            bottom 20px
            left 20px
          .bottom_right
            bottom 20px
            right 20px
          .desk_content
            width 80px
            height 80px
            background peru
            position absolute
            top 50%
            left 50%
            border-radius 5px
            transform translate(-50%, -50%)

    .message_board
      .title
        font-size 20px
        text-align center
        margin-top 10px
      .message_content
        box-sizing border-box
        padding 20px
        height 690px
        overflow-y scroll
        .message_item
          margin-top 10px
          background #5aab0a
          border-radius 5px
          padding 5px

  .drawer
    position fixed
    top 0
    left 0
    z-index 50
    width 100%
    height 100%
    background rgba(0, 0, 0, .1)
    .drawer_content
      position absolute
      top 5px
      right 10px
      width 300px
      height 98%
      .user
        width 100%
        height 50px
        border-radius 10px
        box-shadow #dedede 0px 0px 2px 2px
        text-align center
        line-height 50px
      .title
        text-align center
        height 20px
        font-size 16px
      .makeAnAppointment
        box-sizing border-box
        width 100%
        height 500px
        border-radius 10px
        margin-top 5px
        box-shadow #dedede 0px 0px 2px 2px
        padding 10px
        overflow-y scroll
        .makeItem
          box-sizing border-box
          padding 15px 0 0 10px
          width 100%
          height 130px
          background #8cc5ff
          border-radius 5px
          margin-top 10px
          color 303133
          &:first-of-type
            margin-top 0

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transform translate(100%)
  }
</style>