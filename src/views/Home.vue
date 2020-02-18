<template>
  <div class="home">
    <logIn v-if="logInFlag"></logIn>
    <el-card class="box_card" shadow="always">
      <el-row class="time_select" align="middle">
        <el-col :span="2">
          <div>时间</div>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateValue"
            align="left"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-time-select
            is-range
            v-model="timeValue1"
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
            is-range
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
        <el-col :span="8">
          总计:一层总计64个座位 已预约:{{amount}}个座位
        </el-col>
      </el-row>
      <el-card class="seat" :body-style="{display:'flex',
        'flex-wrap':'wrap',
        'justify-content':'space-between',
        'padding': '0 20px',
        'align-content': 'space-between'
        }"
               shadow="always">
        <el-card class="desk" shadow="always" v-for="(item) in seatData" :key="item.code">
          <template v-for="it in item.seat">
            <div :key="it.seatCode">
              <i class="el-icon-user-solid" :class="{iconColor:it.flag}"></i>
              {{it.seatCode}}
            </div>
          </template>

        </el-card>
      </el-card>
    </el-card>
  </div>
</template>

<script>
  // @ is an alias to /src
  import logIn from '../components/logIn'

  export default {
    name: 'Home',
    data() {
      let userName = localStorage.getItem('userName') || ""
      let pass = localStorage.getItem('pass') || ""
      let logInFlag = false
      if (userName && pass) {
        logInFlag = false
      } else {
        logInFlag = true
      }
      return {
        logInFlag: logInFlag, // 是否登录
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
        seatData: null
      }
    },
    components: {
      logIn
    },
    created() {
      this.seatDataPost(1)
    },
    methods: {
      seatDataPost(id) {
        this.$ajax('/seatData', {
          id: id
        }).then((res) => {
          this.seatData = res.floor.desk
          let amount = 0
          this.seatData.forEach((item) => {
            item.seat.forEach((it)=>{
              if(it.flag){
                amount++
              }
            })
          })
          this.amount = amount
          console.log(this.seatData);
        })
      }
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
</style>