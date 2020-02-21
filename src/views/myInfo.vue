<template>
  <div class="my_info">
    <div class="floating" @click="drawerIsShow">
      我的
    </div>
    <transition name="fade">
      <div v-show="drawer" class="drawer" @click="handleClose">
        <el-card v-if="userSeatData&&userSeatData.length" shadow="always" class="drawer_content">
          <div class="user">用户名:{{userName}}</div>
          <div class="makeAnAppointment">
            <div class="title">预约信息</div>
            <div class="makeItem" v-for="(item, index) in userSeatData" :key="index">
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
  import db from '../db'
  import {formatTime} from '../tools/util'

  export default {
    name: "my-info",
    data() {
      return {
        drawer: false,
        userSeatData: [], // 我的预约信息
      };
    },
    computed: {
      userName() {
        return localStorage.getItem('userName')
      }
    },
    methods: {
      // 控制显示
      drawerIsShow() {
        console.log('点击反应');
        this.getSeat()
        this.drawer = true

      },
      // 我的预约信息
      getSeat() {
        let userId = localStorage.getItem('userId') * 1
        let userSeatData = []
        db.user.where('id').anyOf([userId]).each((res) => {
          userSeatData = res.seat
        }).then(() => {
          userSeatData.forEach((item) => {
            item.startTime = formatTime(item.startTime, "Y-M-D h:00")
            item.endTime = formatTime(item.endTime, 'h:00')
          })
          this.userSeatData = userSeatData
        })
      },
      handleClose(done) {
        this.drawer = false
      },
      load() {

      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .my_info
    .floating
      position fixed
      right 0
      top 0
      margin-top 20px
      margin-right 20px
      width 50px;
      height 50px;
      background #409EFF
      border-radius 50%
      text-align center
      line-height 50px
      color white
      box-shadow 2px 2px 5px #888888
      z-index: 2;
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
        .makeAnAppointment
          box-sizing border-box
          width 100%
          height 500px
          border-radius 10px
          margin-top 5px
          box-shadow #dedede 0px 0px 2px 2px
          padding 10px
          .title
            text-align center
            height 20px
            font-size 16px
          .makeItem
            box-sizing border-box
            padding 15px 0 0 10px
            width 100%
            height 100px
            background #8cc5ff
            border-radius 5px
            margin-top 10px
            color 303133

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transform translate(100%)
  }
</style>