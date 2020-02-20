<template>
  <div class="home">
    <!--<logIn v-if="logInFlag"></logIn>-->
    <logIn v-if="logInFlag"></logIn>
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
        <el-col :span="6">
          <el-time-select
            @change="timeSelect"
            v-model="timeValue1"
            :disabled="timeValue1Disabled"
            :picker-options="{
                start: '08:00',
                step: '1:00',
                end: '21:00',
                minTime:startMinTime
              }"
            placeholder="开始时间">
          </el-time-select>
        </el-col>
        <el-col :span="6">
          <el-time-select
            :disabled="timeValue2Disabled"
            @change="timeSelect"
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
            <div class="desk_seat" :key="it.seatCode" @click="deskSeatSelect(item,it)" :class="{top_left:ind===0,
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
  </div>
</template>

<script>
  // @ is an alias to /src
  import logIn from '../components/logIn'
  import {formatTime} from '../tools/util'
  import db from '../db'

  export default {
    name: 'Home',
    data() {
      return {
        dateValue: '', // 天
        timeValue1: '', // 开始时间
        timeValue2: '', // 结束时间
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
        appointmentDate: ''
      }
    },
    components: {
      logIn
    },
    computed: {
      startMinTime() {
        let time = '7:00'
        let dateDay = ''
        let nowDay = formatTime(new Date().getTime(), 'D')
        if (this.dateValue) {
          dateDay = formatTime(this.dateValue * 1, 'D')
          if (dateDay === nowDay) {
            time = formatTime(new Date().getTime(), 'h:00')
          }
        }
        return time
      },
      timeValue1Disabled() {
        return !this.dateValue
      },
      timeValue2Disabled() {
        return !this.dateValue || !this.timeValue1
      },
      logInFlag(){
        let userName = localStorage.getItem('userName') || ""
        let pass = localStorage.getItem('pass') || ""
        let logInFlag = false
        if (userName && pass) {
          logInFlag = false
        } else {
          logInFlag = true
        }
        return logInFlag
      }
    },
    created() {

    },
    methods: {
      // 获取座位数据
      seatDataPost(id) {
        this.floor = id
        let seatData = []
        db.tasks.where('floor').anyOf([id]).each((res) => {
          seatData.push(res)
        }).then(() => {
          let amount = 0
          seatData.forEach((item) => {
            item.seat.forEach((it) => {
              let startTime = new Date(this.appointmentDate + ' ' + this.timeValue1).getTime()
              let endTime = new Date(this.appointmentDate + ' ' + this.timeValue2).getTime()
              if (startTime >= it.endTime || endTime <= it.startTime) {
                it.flag = false
              } else {
                it.flag = true
                amount++
              }
            })
          })
          this.seatData = seatData
          this.amount = amount + ""
        })
      },
      // 时间选择
      timeSelect() {
        let appointmentDate = ''
        if (this.dateValue) {
          let selectDate = new Date(this.dateValue).getTime()
          appointmentDate = formatTime(selectDate, 'Y-M-D')
        }
        if (appointmentDate && this.timeValue1 && this.timeValue2) {
          console.log(appointmentDate, this.timeValue1, this.timeValue2);
          this.appointmentDate = appointmentDate
          this.seatDataPost(this.floor)
        }
      },
      // 座位选择
      deskSeatSelect(desk, seat) {
        let that = this
        if (seat.flag) {
          this.$alert('此座位已被预约', '提示')
        } else {
          let userId = localStorage.getItem('userId') * 1

          this.$confirm('是否预约此座位', '提示').then(() => {
            db.tasks.where("id").equals(desk.id).modify((res) => {
              res.seat.forEach((item, index, arr) => {
                if (seat.seatCode === item.seatCode) {
                  arr[index] = {
                    startTime: new Date(that.appointmentDate + ' ' + that.timeValue1).getTime(),
                    endTime: new Date(that.appointmentDate + ' ' + that.timeValue2).getTime(),
                    seatCode: item.seatCode
                  }
                }
              })
            }).then(() => {
              db.user.where("id").equals(userId).modify((userRes) => {
                userRes.seat[userRes.seat.length] = {
                  floor:that.floor,
                  startTime: new Date(that.appointmentDate + ' ' + that.timeValue1).getTime(),
                  endTime: new Date(that.appointmentDate + ' ' + that.timeValue2).getTime(),
                  seatCode: seat.seatCode
                }
              }).then(()=>{
                that.$alert('您已预约成功','提示').then(()=>{
                  that.seatDataPost(that.floor)
                })
              })
            })
          }).catch((err) => {
            console.log(err);
          })
        }
      },
      //  时间筛选
      formatTime
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .home
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

</style>