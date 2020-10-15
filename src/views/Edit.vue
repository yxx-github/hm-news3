<template>
  <div>
    <!-- 头部 -->
    <hm-header>编辑资料</hm-header>

    <!-- 头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt>
      <van-uploader class="uploader" :after-read="afterRead"/>
    </div>

    <!-- 列表 -->
    <van-cell-group>
      <van-cell @click="showNickname" title="昵称" is-link :value="info.nickname"/>
      <van-cell title="密码" is-link value="******"/>
      <van-cell @click="showGender" title="性别" is-link :value="info.gender === 1? '男' : '女'"/>
    </van-cell-group>

    <!-- 修改昵称弹框 -->
    <van-dialog @confirm="confirmNickname" v-model="isShowNickname" title="修改昵称" show-cancel-button>
      <van-field v-model="nickname" placeholder="请输入新的昵称"/>
    </van-dialog>

    <!-- 修改性别弹框 -->
    <van-dialog @confirm="confirmGender" v-model="isShowGender" title="修改性别" show-cancel-button>
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <template #right-icon>
              <van-radio :name="1"/>
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <template #right-icon>
              <van-radio :name="0"/>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
      isShowNickname: false,
      nickname: '',
      isShowGender: false,
      gender: 0
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      let token = localStorage.getItem('token')
      let user_id = localStorage.getItem('user_id')

      let res = await this.$axios.get(`/user/${user_id}`)
      const { statusCode, message, data } = res.data
      if (statusCode === 200) {
        this.info = data
      } else {
        this.$toast.fail(message)
      }
    },
    // 是否显示修改昵称弹框
    showNickname() {
      // 显示
      this.isShowNickname = true
      // 修改nickname值
      this.nickname = this.info.nickname
    },
    // 点击弹框内的确定按钮
    confirmNickname() {
      // 请求前的判断
      if (this.nickname === this.info.nickname) {
        this.$toast('前后昵称不能一样')
        return
      }
      this.ml_editUser({
        nickname: this.nickname
      })
    },
    // 是否显示修改性别弹框
    showGender() {
      // 显示
      this.isShowGender = true
      // 修改性别
      this.gender = this.info.gender
    },
    // 点击弹框内的确定按钮
    confirmGender() {
      // 请求前的判断
      if (this.gender === this.info.gender) {
        this.$toast('前后性别不可以一样')
        return
      }
      this.ml_editUser({
        gender: this.gender
      })
    },
    // 封装修改用户信息
    async ml_editUser(data) {
      let user_id = localStorage.getItem('user_id')
      let res = await this.$axios.post(`/user_update/${user_id}`, data)
      if (res.data.statusCode === 200) {
        this.$toast.success(res.data.message)
        this.getInfo()
      } else {
        this.$toast.fail(res.data.message)
      }
    },
    afterRead(data) {
      let formdata = new FormData()
      formdata.append('file', data.file)

      // 上传
      this.$axios.post('/upload', formdata).then(res => {
        const { statusCode, message, data } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          this.ml_editUser({
            head_img: data.url
          })
        } else {
          this.$toast.fail(message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  position: relative;
  text-align: center;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    margin: 20px 0;
  }
  .uploader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
  }
}
</style>
