<template>
  <div class="log_in">
    <div class="content">
      <div class="title">
        注册
      </div>
      <!--<div class="user_name clear">-->
        <!--<div class="fl">用户名</div>-->
        <!--<input type="text">-->
      <!--</div>-->
      <!--<div class="password">-->

      <!--</div>-->
      <!--<div class="affirm_password">-->

      <!--</div>-->
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="auto" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName" class="form_itme user_name">
          <el-input type="text" v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" class="form_itme password">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" class="form_itme">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
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
      var userName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules: {
          userName:[
            { validator: userName, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
    background rgba(0,0,0,.5)

    .content
      position absolute
      top 50%
      left 50%
      transform translate(-50%,-50%)
      width 400px
      height 300px
      background white
      border-radius 10px
      .title
        color #333333
        font-size 20px
        text-align content
        margin-top 20px
      .demo-ruleForm
        width 100%
        .form_itme
          padding-right 20px
</style>