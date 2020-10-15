<template>
  <div>
    <!-- 头部 -->
    <hm-header>注册</hm-header>

    <!-- logo -->
    <hm-logo></hm-logo>

    <!-- 输入框 -->
    <van-field
      v-model="username"
      required
      label="用户名"
      placeholder="请输入用户名"
      :error-message="usernameErrMsg"
      clearable
      @input="checkUsername"
      @clear="clearUsername"
    />
    <van-field
      v-model="nickname"
      required
      label="昵称"
      placeholder="请输入昵称"
      :error-message="nicknameErrMsg"
      clearable
      @input="checkNickname"
      @clear="clearNickname"
    />
    <van-field
      v-model="password"
      required
      label="密码"
      placeholder="请输入密码"
      :error-message="passwordErrMsg"
      clearable
      @input="checkPassword"
      @clear="clearPassword"
    />

    <!-- 按钮 -->
    <hm-button @click.native="startRegister">注册</hm-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '', // 用户名
      nickname: '', // 昵称
      password: '', // 密码
      usernameErrMsg: '', // 用户名校验信息
      nicknameErrMsg: '', // 昵称校验信息
      passwordErrMsg: '' // 密码校验信息
    }
  },
  methods: {
    // 校验用户名
    checkUsername() {
      const reg = /^1\d{1,5}$/
      if (reg.test(this.username)) {
        this.usernameErrMsg = ''
      } else {
        this.usernameErrMsg = '用户名格式错误'
      }
    },
    // 校验昵称
    checkNickname() {
      const reg = /^[\u4e00-\u9fa5]{3,7}$/
      if (reg.test(this.nickname)) {
        this.nicknameErrMsg = ''
      } else {
        this.nicknameErrMsg = '昵称格式错误'
      }
    },
    // 校验密码
    checkPassword() {
      const reg = /^\d{3,12}$/
      if (reg.test(this.password)) {
        this.passwordErrMsg = ''
      } else {
        this.passwordErrMsg = '密码格式错误'
      }
    },
    // 清除用户名
    clearUsername() {
      this.usernameErrMsg = ''
    },
    // 清除昵称
    clearNickname() {
      this.nicknameErrMsg = ''
    },
    // 清除密码
    clearPassword() {
      this.passwordErrMsg = ''
    },
    async startRegister() {
      if (
        this.username !== '' &&
        this.nickname !== '' &&
        this.password !== '' &&
        this.usernameErrMsg === '' &&
        this.nicknameErrMsg === '' &&
        this.passwordErrMsg === ''
      ) {
        let res = await this.$axios.post('http://localhost:3000/register', {
          username: this.username,
          nickname: this.nickname,
          password: this.password
        })

        if (res.data.statusCode === 200) {
          // 1. 提示
          this.$toast.success(res.data.message)
          // 2. 跳转到login
          this.$router.push({
            name: 'login',
            params: {
              username: this.username,
              password: this.password
            }
          })
        } else {
          this.$toast.fail(res.data.message)
        }
      } else {
        this.$toast.fail('校验失败')
      }
    }
  }
}
</script>

<style>
</style>
