<template>
  <div class="log_in" v-if="logInFlag">
    <div class="content">
      <div class="title">
        <span @click="registerText" class="register_text" :class="{'register_flag':!registerFlag}">注册</span>/<span @click="logInText" :class="{'register_flag':registerFlag}" class="log_in_text">登录</span>
      </div>
      <el-form  v-if="registerFlag" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="auto" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName" class="form_itme user_name">
          <el-input type="text" placeholder="用户名由12位英文字母和数字组成" maxlength="6" v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" class="form_itme password">
          <el-input type="password" placeholder="密码由6-12位英文字母和数字组成" maxlength="12" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="affirm" class="form_itme password">
          <el-input type="password" placeholder="请再次输入密码" maxlength="12" v-model="ruleForm.affirm"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form>
      <el-form v-else :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="auto" class="demo-ruleForm">
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
  </div>
</template>

<script>
  export default {
    name: "log-in",
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
            }else if(!reg.test(this.ruleForm.pass)){
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
      return {
        logInFlag: true, // 登陆成功是否
        registerFlag:true, // 登录||注册
        ruleForm: {
          userName: '',
          pass: '',
          affirm:''
        }, // 用户输入内容
        rules: {
          userName: [
            {validator: userName, trigger: 'blur'}
          ],
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          affirm:[
            {validator: validatePass2, trigger: 'blur'}
          ]
        } // 用户输入内容规则判定
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let usersList = localStorage.getItem('usersList')
            if(this.registerFlag){ // 是注册还是登录
              // 注册
              if(usersList){
                usersList = JSON.parse(usersList)
                let flag = usersList.findIndex((item)=>{
                  return item.userName === this.ruleForm.userName
                })
                if(flag == -1){
                  usersList.push({
                    userName:this.ruleForm.userName,
                    pass:this.ruleForm.pass
                  })
                  localStorage.setItem("usersList",JSON.stringify(usersList));
                  this.$notify({
                    title: '提示',
                    message: '注册并登录成功',
                    duration: 0
                  })
                  this.succeedLogIn()
                }else {
                  this.$notify({
                    title: '提示',
                    message: '此账号已被注册，请更换用户名',
                    duration: 0
                  })
                }
              }else {
                usersList.push({
                  userName:this.ruleForm.userName,
                  pass:this.ruleForm.pass
                })
                localStorage.setItem("usersList",JSON.stringify(usersList));
                this.$notify({
                  title: '提示',
                  message: '注册并登录成功',
                  duration: 0
                })
                this.succeedLogIn()
              }
            }else {
              // 登录
              if(usersList){
                usersList = JSON.parse(usersList)
                let flag = usersList.findIndex((item)=>{
                  return item.userName === this.ruleForm.userName
                })
                if(flag === -1){
                  this.$notify({
                    title: '提示',
                    message: '此账号未注册，请先去注册',
                    duration: 0
                  })
                }else {
                  if(usersList[flag].pass === this.ruleForm.pass){
                    this.$notify({
                      title: '提示',
                      message: '登录成功',
                      duration: 0
                    })
                    this.succeedLogIn()
                  }else {
                    this.$notify({
                      title: '提示',
                      message: '密码错误，请重新输入',
                      duration: 0
                    })
                  }
                }
              }else {
                this.$notify({
                  title: '提示',
                  message: '此账号未注册，请先去注册',
                  duration: 0
                })
              }
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 成功注册或登录逻辑
      succeedLogIn(){
        localStorage.setItem('userName',this.ruleForm.userName)
        localStorage.setItem('pass',this.ruleForm.pass)
        this.logInFlag = false
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 点击登录
      logInText(){
        this.registerFlag = false
      },
      // 点击注册
      registerText(){
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
      height 300px
      background white
      border-radius 10px
      .title
        color #333333
        font-size 18px
        text-align content
        margin-top 20px
        .register_flag
          color #1f6fff
          cursor pointer
      .demo-ruleForm
        width 100%
        margin-top 10px
        .form_itme
          padding-right 20px
          padding 0 20px
</style>