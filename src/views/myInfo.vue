<template>
  <div class="my_info">
    <div class="floating" @click="drawerIsShow">
      我的
    </div>
    <transition name="fade">
      <div v-show="drawer" class="drawer" @click.self="handleClose">
        <el-card shadow="always" class="drawer_content">
          <div class="user">用户名:{{userName}}</div>
          <div class="title">预约信息</div>
          <div class="makeAnAppointment">
            <div v-if="userSeatData&&userSeatData.length" @click="DialogVisibleIsShow(item,index)" class="makeItem"
                 v-for="(item, index) in userSeatData"
                 :key="index">
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
          <div class="user_operation_btn">
            <el-button class="quit" type="primary" @click="leaveAMessage">留言</el-button>
            <el-button class="quit" type="primary" @click="quit">退出</el-button>
          </div>
        </el-card>
      </div>
    </transition>
    <div class="info" v-if="DialogVisible">
      <div class="info_content">
        <div class="title">
          预约详情
        </div>
        <div class="info_floor">
          楼层:{{seatItem.floor}}F
        </div>
        <div>
          座位:{{seatItem.seatCode}}
        </div>
        <div>
          时间:{{seatItem.startTime+'到'+seatItem.endTime}}
        </div>
        <div class="info_footer_btn">
          <el-button type="primary" @click="delect">删除</el-button>
          <el-button type="primary" @click="infoClose">确定</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      title="留言板"
      :visible.sync="isMessage"
      width="50%">
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        maxlength="200"
        show-word-limit
        v-model="textarea">
      </el-input>
      <span slot="footer">
    <el-button @click="isMessage = false">取 消</el-button>
    <el-button type="primary" @click="messageConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import db from '../db'
  import {formatTime} from '../tools/util'

  export default {
    name: "my-info",
    data() {
      let userName = localStorage.getItem('userName')
      return {
        userName: userName,
        drawer: false,
        userSeatData: [], // 我的预约信息
        DialogVisible: false,
        seatItem: {},
        isMessage:false, // 留言板显示
        textarea:''// 留言板内容
      };
    },
    computed: {},
    methods: {
      // 关闭详情
      infoClose() {
        this.DialogVisible = false
      },
      // 删除此信息
      delect() {
        let userId = localStorage.getItem('userId') * 1
        let that = this
        this.$confirm('是否确定删除此信息', '提示').then(() => {
          db.user.where("id").equals(userId).modify((res) => {
            res.seat.splice(that.seatItem.index, 1)
          }).then(() => {
            that.getSeat().then(() => {
              that.DialogVisible = false
            })
          })
        }).catch(() => {

        })
      },
      // 详情
      DialogVisibleIsShow(seatItem, index) {
        seatItem.index = index
        this.DialogVisible = true
        this.seatItem = seatItem
      },
      // 控制显示
      drawerIsShow() {
        this.getSeat()
        this.drawer = true
      },
      // 我的预约信息
      async getSeat() {
        this.userName = localStorage.getItem('userName')
        let userId = localStorage.getItem('userId') * 1
        let userSeatData = []
        db.user.where('id').anyOf([userId]).each((res) => {
          console.log(res);
          userSeatData = res.seat
        }).then(() => {
          userSeatData = userSeatData.filter((item)=>{
            return item.endTime > Date.now()
          })
          userSeatData.forEach((item) => {
            item.startTime = formatTime(item.startTime, "Y-M-D h:00")
            item.endTime = formatTime(item.endTime, 'h:00')
          })

          this.userSeatData = userSeatData
        })
      },
      handleClose() {
        this.drawer = false
      },
      // 退出
      quit() {
        this.$confirm('是否确定退出', '提示').then(() => {
          localStorage.setItem('userName', '')
          localStorage.setItem('pass', '')
          localStorage.setItem('userId', '')
          this.drawer = false
          this.$emit('quit')
        }).catch(() => {
        })
      },
      // 留言
      leaveAMessage() {
        this.isMessage = true
      },
    //  留言确定
      messageConfirm(){
        let userId = localStorage.getItem('userId')
        db.message.put({
          userId:userId,
          userName:this.userName,
          time:new Date().getTime(),
          content:this.textarea
        }).then(()=>{
          this.isMessage = false
          this.$notify({
            title: '提示',
            message: '已发送',
            duration: 0
          })
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .my_info
    .info
      top 0
      left 0
      width 100vw
      height 100vh
      position fixed
      background rgba(0, 0, 0, .3)
      z-index 100
      .title
        text-align center
      .info_footer_btn
        text-align center
        position absolute
        bottom 10px
        left 0
        width 100%
      .info_content
        width 300px
        height 200px
        position absolute
        padding 10px
        top 40%
        left 50%
        transform translate(-50%, -50%)
        background white
        border-radius 10px
        box-shadow 2px 2px 5px #888888
        .info_floor
          margin-top 10px
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
            height 100px
            background #8cc5ff
            border-radius 5px
            margin-top 10px
            color 303133
            &:first-of-type
              margin-top 0
      .user_operation_btn
        text-align center
        margin-top 20px

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transform translate(100%)
  }
</style>