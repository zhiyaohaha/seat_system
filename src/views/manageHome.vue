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
        <el-col :span="6" :push="14">
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
  </div>
</template>

<script>
  import logIn from '../components/logIn'
  import myInfo from './myInfo'
  import {formatTime} from '../tools/util'
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
        seatData: null, // 座位信息
        amount: 0,// 已预约座位
        floor: 1, // 以选择楼层
        appointmentDate: '', // 时间格式
        userSeatData: '', // 预约座位信息
        drawer: false, // 预约座位信息展示
        selectCode:'' // 选择的座位号
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
        await db.tasks.where('floor').anyOf([id]).each((res) => {
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
          await db.user.where('userName').anyOf(userArr).each((res) => {
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
            if(startTime < it.endTime && endTime > it.startTime){
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
        if(item.flag){
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