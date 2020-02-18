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
        <el-col :span="2">
          <el-button type="primary">1F</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary">2F</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary">3F</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary">4F</el-button>
        </el-col>
      </el-row>
      <el-card class="seat">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="desk">

            </el-card>
          </el-col>
        </el-row>
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
        logInFlag: logInFlag,
        dateValue: '',
        timeValue1: '', // 开始时间
        timeValue2: '', // 结束时间
        pickerOptions: {
          disabledDate(time) {
            let mondayTime = Date.now() + 6 * 24 * 60 * 60 * 1000
            let today = Date.now() - 24 * 60 * 60 * 1000
            return time.getTime() < today || time.getTime() > mondayTime;
          }
        },
      }
    },
    components: {
      logIn
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
          height 80px
</style>