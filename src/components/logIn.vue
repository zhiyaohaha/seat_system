<template>
  <div class="log_in" v-if="logInFlag">
    <div class="content">
      <el-tabs v-model="activeName" type="border-card" class="cut_log_in" @tab-click="handleClick">
        <el-tab-pane label="用户登录" class="user_tab tab" name="first">
          <div v-if="activeName === 'first'">
            <div class="title">
              <span @click="registerText" class="register_text" :class="{'register_flag':!registerFlag}">注册</span>/<span
              @click="logInText" :class="{'register_flag':registerFlag}" class="log_in_text">登录</span>
            </div>
            <el-form v-if="registerFlag" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="auto"
                     class="demo-ruleForm">
              <el-form-item label="用户名" prop="userName" class="form_itme user_name">
                <el-input type="text" placeholder="用户名由12位英文字母和数字组成" maxlength="6" v-model="ruleForm.userName"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass" class="form_itme password">
                <el-input type="password" placeholder="密码由6-12位英文字母和数字组成" maxlength="12"
                          v-model="ruleForm.pass"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="affirm" class="form_itme password">
                <el-input type="password" placeholder="请再次输入密码" maxlength="12" v-model="ruleForm.affirm"></el-input>
              </el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form>
            <el-form v-else :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="auto"
                     class="demo-ruleForm">
              <el-form-item label="用户名" prop="userName" class="form_itme user_name">
                <el-input type="text" placeholder="用户名由12位英文字母和数字组成" maxlength="6" v-model="ruleForm.userName"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass" class="form_itme password">
                <el-input type="password" placeholder="密码由12位英文字母和数字组成" maxlength="12" v-model="ruleForm.pass"></el-input>
              </el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="管理员登录" class="manage_tab tab" name="second">
          <el-form v-if="activeName === 'second'" :model="manageRuleForm" status-icon :rules="manageRules" ref="manageRuleForm"
                   label-width="auto"
                   class="demo-ruleForm">
            <el-form-item label="用户名" prop="userName" class="form_itme user_name">
              <el-input type="text" placeholder="用户名由12位英文字母和数字组成" maxlength="5"
                        v-model="manageRuleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass" class="form_itme password">
              <el-input type="password" placeholder="密码由12位英文字母和数字组成" maxlength="6"
                        v-model="manageRuleForm.pass"></el-input>
            </el-form-item>
            <el-button type="primary" @click="manageSubmitForm('manageRuleForm')">提交</el-button>
            <el-button @click="manageResetForm('manageRuleForm')">重置</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
  import db from '../db'

  export default {
    name: "log-in",
    props: {
      logInFlag: {
        type: Boolean,
        required: true
      }
    },
    data() {
      // 用户输入内容规则
      let reg = new RegExp(/^[a-z0-9]+$/i)
      let userName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          if (this.ruleForm.userName !== '') {
            if (this.ruleForm.userName.length !== 6) {
              callback(new Error('用户名不能小于6位'));
            } else if (!reg.test(this.ruleForm.userName)) {
              callback(new Error('存在非法字符'));
            }
          }
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.pass !== '') {
            if (this.ruleForm.pass.length < 6) {
              callback(new Error('密码不能小于6位'));
            } else if (!reg.test(this.ruleForm.pass)) {
              callback(new Error('存在非法字符'));
            }
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let manageUserName= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          if (this.manageRuleForm.userName !== 'admin') {
            callback(new Error('用户名不正确'));
          }
          callback();
        }
      }
      let managePass= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.manageRuleForm.pass !== '000000') {
            callback(new Error('密码不正确'));
          }
          callback();
        }
      }
      return {
        registerFlag: true, // 登录||注册
        ruleForm: {
          userName: '',
          pass: '',
          affirm: ''
        }, // 用户输入内容
        rules: {
          userName: [
            {validator: userName, trigger: 'blur'}
          ],
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          affirm: [
            {validator: validatePass2, trigger: 'blur'}
          ]
        }, // 用户输入内容规则判定
        activeName: 'first',
        manageRuleForm: {
          userName: '',
          pass: ''
        },
        manageRules: {
          userName: [
            {validator: manageUserName, trigger: 'blur'}
          ],
          pass: [
            {validator: managePass, trigger: 'blur'}
          ]
        }
      };
    },
    created() {

    },
    computed: {},
    methods: {
      // 切换用户
      handleClick(tab, event) {

      },
      // 管理员登录
      manageSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            localStorage.setItem('userName','admin')
            localStorage.setItem('pass','000000')
            localStorage.setItem('userId','0')
            this.$emit('manage')
          }
        })
      },
      // 管理员重置
      manageResetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 登录逻辑
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            db.user.toArray().then((res) => {
              let usersList = res
              // 是注册还是登录
              if (this.registerFlag) {
                // 注册
                if (usersList && usersList.length) {
                  let flag = usersList.findIndex((item) => {
                    return item.userName === this.ruleForm.userName
                  })
                  if (flag == -1) {
                    this.succeeRegister(this.succeedLogIn)
                    this.$notify({
                      title: '提示',
                      message: '注册并登录成功',
                      duration: 0
                    })
                  } else {
                    this.$notify({
                      title: '提示',
                      message: '此账号已被注册，请更换用户名',
                      duration: 0
                    })
                  }
                } else {
                  this.succeeRegister(this.succeedLogIn)
                  this.$notify({
                    title: '提示',
                    message: '注册并登录成功',
                    duration: 0
                  })
                }
              } else {
                // 登录
                if (usersList && usersList.length) {
                  let flag = usersList.findIndex((item) => {
                    return item.userName === this.ruleForm.userName
                  })
                  if (flag === -1) {
                    this.$notify({
                      title: '提示',
                      message: '此账号未注册，请先去注册',
                      duration: 0
                    })
                  } else {
                    if (usersList[flag].pass === this.ruleForm.pass) {
                      this.$notify({
                        title: '提示',
                        message: '登录成功',
                        duration: 0
                      })
                      this.succeedLogIn(usersList[flag].id)
                    } else {
                      this.$notify({
                        title: '提示',
                        message: '密码错误，请重新输入',
                        duration: 0
                      })
                    }
                  }
                } else {
                  this.$notify({
                    title: '提示',
                    message: '此账号未注册，请先去注册',
                    duration: 0
                  })
                }
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 注册逻辑
      succeeRegister(cb) {
        db.user.add({
          userName: this.ruleForm.userName,
          pass: this.ruleForm.pass,
          seat: []
        }).then((res) => {
          cb && cb(res)
        })
      },
      // 成功登录逻辑
      succeedLogIn(id) {
        localStorage.setItem('userName', this.ruleForm.userName)
        localStorage.setItem('pass', this.ruleForm.pass)
        id && localStorage.setItem('userId', id)
        this.$emit('succeedLogIn')
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 点击登录
      logInText() {
        this.registerFlag = false
      },
      // 点击注册
      registerText() {
        this.registerFlag = true
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .log_in
    position fixed
    left 0
    top 0
    z-index 100
    width 100vw
    height 100vh
    background rgba(0, 0, 0, .5)
    .content
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 400px
      background white
      border-radius 10px
      .cut_log_in
        .tab
          height 100%
      .title
        color #333333
        font-size 16px
        text-align center
        .register_flag
          color #1f6fff
          cursor pointer
      .demo-ruleForm
        text-align center
        width 100%
        margin-top 10px
        .form_itme
          padding-right 20px
          padding 0 20px
</style>