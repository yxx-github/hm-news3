<template>
  <div>
    <!-- 头部 -->
    <div class="m">
      <div ref="box"></div>
      <div class="header">
        <div class="left" @click="$router.back()">
          <i class="iconfont iconjiantou2"></i>
        </div>
        <div class="center">
          <i class="iconfont iconnew"></i>
        </div>
        <div class="right">
          <div @click="unfollow" v-if="detail.has_follow" class="follow">已关注</div>
          <div @click="follow" v-else class="follow">关注</div>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="container">
      <div class="title line2">{{ detail.title }}</div>
      <div class="name">
        <span>{{ detail.user.nickname }}</span>
        <span>{{ detail.create_date | date }}</span>
      </div>
      <!-- 文本内容 -->
      <div v-if="detail.type === 1" class="content" v-html="detail.content"></div>
      <!-- 视频 -->
      <video v-else :src="detail.content" controls></video>
      <!-- 点赞 -->
      <div class="bottom">
        <div @click="like" class="like" :class="{active: detail.has_like}">
          <i class="iconfont icondianzan"></i>
          <i>{{detail.like_length}}</i>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <van-list
      v-model="loading"
      :finished="finished"
      @load="onLoad"
      :immediate-check="false"
      finished-text="没有更多了"
    >
      <!-- 评论 -->
      <div class="comments">
        <hm-comment v-for="(comment,index) in commentList" :key="index" :comment="comment"></hm-comment>
      </div>
    </van-list>

    <!-- 底部 -->
    <div class="f">
      <div class="footer">
        <div class="input" v-if="!isShow">
          <div class="left">
            <input ref="input" @focus="handleFocus" type="text" placeholder="写跟帖">
          </div>
          <div class="center">
            <van-icon name="chat-o" :badge="detail.comment_length"/>
          </div>
          <div class="right" @click="star">
            <van-icon name="star-o" :class="{ active: detail.has_star }"/>
          </div>
        </div>
        <div class="textarea" v-else>
          <div class="left">
            <textarea
              v-model="content"
              ref="textarea"
              @blur="handleBlur"
              :placeholder="replyName ? '回复:' + replyName: '请输入内容'"
            ></textarea>
          </div>
          <div class="right">
            <div @touchstart="send" class="send">发送</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        user: {}
      }, //详情信息
      commentList: [], // 评论列表
      isShow: false, // 控制 textarea 是否显示
      replyId: '', // 回复id
      replyName: '', // 回复昵称
      content: '', //回复内容
      loading: false, // 是否在上一次的加载中
      finished: false, // 是否全部加载完成
      pageIndex: 1,
      pageSize: 10
    }
  },
  created() {
    this.getDetail()
    this.getComments()

    // 哪里接收。哪里注册
    this.$bus.$on('reply', async (replyId, replyName) => {
      console.log('reply走了', replyId, replyName)
      // 保存
      this.replyId = replyId // 用来发送请求
      this.replyName = replyName // 仅仅用来显示在 textarea

      // 显示textarea
      this.isShow = true
      // 自动聚焦
      await this.$nextTick()
      this.$refs.textarea && this.$refs.textarea.focus()
    })
  },
  methods: {
    // 获取文章详情
    async getDetail() {
      let res = await this.$axios.get(`/post/${this.$route.params.id}`)
      console.log('文章详情', res.data.data)
      if (res.data.statusCode === 200) {
        this.detail = res.data.data
      }
    },
    // 取消关注
    async unfollow() {
      let res = await this.$axios.get(`/user_unfollow/${this.detail.user.id}`)
      if (res.data.statusCode === 200) {
        // 提示信息
        this.$toast.success(res.data.message)
        // 重新请求
        this.getDetail()
      }
    },
    // 关注
    async follow() {
      // 判断有没有登录
      let token = localStorage.getItem('token')
      if (!token) {
        // 提示
        this.$toast('请去登录')
        // 跳转到登录页
        this.$router.push({
          name: 'login',
          params: {
            back: true
          }
        })
        return
      }
      let res = await this.$axios.get(`/user_follows/${this.detail.user.id}`)
      if (res.data.statusCode === 200) {
        // 提示信息
        this.$toast.success(res.data.message)
        // 重新请求
        this.getDetail()
      }
    },
    // 点赞
    async like() {
      // 判断有没有登录
      let token = localStorage.getItem('token')
      if (!token) {
        // 提示
        this.$toast('请先去登录')
        // 跳转
        this.$router.push({
          name: 'login',
          params: {
            back: true
          }
        })
        return
      }
      // 请求
      let res = await this.$axios.get(`/post_like/${this.detail.id}`)
      if (res.data.statusCode === 200) {
        // 提示
        this.$toast.success(res.data.message)
        // 重新请求
        this.getDetail()
      }
    },
    // 获取评论列表
    async getComments() {
      if (this.commentList.length > 0 && this.pageIndex === 1) {
        this.commentList = []
      }
      let res = await this.$axios.get(
        `/post_comment/${this.$route.params.id}`,
        {
          params: {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        }
      )
      if (res.data.statusCode === 200) {
        this.commentList = [...this.commentList, ...res.data.data]
        // this.commentList = res.data.data
        console.log(this.commentList)
        this.loading = false
        if (res.data.data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    // 聚焦
    async handleFocus() {
      // 让 textarea显示
      this.isShow = true
      // 自动聚焦
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    // 失焦
    handleBlur() {
      this.isShow = false
      if (!this.content) {
        // 判断 有内容的时候不清空 没内容的时候就清空
        // 失焦的时候,让 replyId 和 replyName 清空
        this.replyId = ''
        this.replyName = ''
      }
    },
    // 点击发送
    async send() {
      console.log('发送')
      let res = await this.$axios.post(
        `/post_comment/${this.$route.params.id}`,
        {
          content: this.content,
          parent_id: this.replyId
        }
      )
      if (res.data.statusCode === 200) {
        console.log(res.data)
        // 提示
        this.$toast.success(res.data.message)

        // 让页面回到第一页
        this.pageIndex = 1

        // 重新请求评论列表
        this.getComments()

        // 重新开启分页加载
        this.loading = true
        this.finished = false

        // 清空原来的数据
        this.commentList = []

        // 清空
        this.replyId = ''
        this.replyName = ''
        this.content = ''

        // 隐藏textarea
        this.isShow = false

        // 滚动到某个位置
        this.$refs.box.scrollIntoView()
      }
    },
    // 点击收藏
    async star() {
      let res = await this.$axios.get(`/post_star/${this.$route.params.id}`)
      if (res.data.statusCode === 200) {
        // 提示
        this.$toast.success(res.data.message)
        // 重新请求数据
        this.getDetail()
      }
    },
    // 触底
    onLoad() {
      console.log('触底加载')
      this.pageIndex++
      this.getComments()
    }
  }
}
</script>

<style lang="less" scoped>
.m {
  height: 50px;
  .header {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;

    .left {
      width: 40px;
      text-align: center;
      i {
        font-size: 20px;
      }
    }
    .center {
      flex: 1;
      i {
        font-size: 50px;
        padding-left: 10px;
      }
    }
    .right {
      width: 80px;
      .follow {
        width: 54px;
        height: 20px;
        border: 1px solid #666;
        text-align: center;
        line-height: 21px;
        border-radius: 10px;
      }
    }
  }
}

.container {
  padding: 10px;
  .title {
    font-size: 18px;
    font-weight: 700;
    margin: 10px 0;
  }
  .name {
    color: #999;
    span {
      margin-right: 15px;
    }
  }
  .content {
    margin-top: 10px;
  }
}
/deep/ img {
  width: 100%;
}
video {
  width: 100%;
  margin-top: 10px;
}
// 点赞
.bottom {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
  .like {
    width: 80px;
    height: 30px;
    border: 1px solid #666;
    text-align: center;
    line-height: 30px;
    border-radius: 15px;
    i {
      margin: 0 5px;
      color: #666;
    }
  }
  .like.active {
    border: 1px solid #f00;
    i {
      color: red;
    }
  }
}
.comments {
  border-top: 1px solid #ccc;
  // padding-bottom: 40px;
}
// 底部
.f {
  height: 40px;
  .footer {
    background-color: #fff;
    border-top: 1px solid #ccc;
    position: fixed;
    bottom: 0;
    width: 100%;
    .input {
      height: 40px;
      display: flex;

      .left {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        input {
          width: 80%;
          height: 30px;
          border: none;
          background-color: #ddd;
          border-radius: 15px;
          text-indent: 1em;
        }
      }
      .center,
      .right {
        width: 60px;
        font-size: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .active {
        color: #f00;
      }
    }
    .textarea {
      height: 70px;
      display: flex;
      .left {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        textarea {
          border: none;
          width: 90%;
          height: 75%;
          border-radius: 8px;
          resize: none;
          background-color: #ddd;
          text-indent: 1em;
          padding-top: 5px;
        }
      }
      .right {
        width: 80px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .send {
          width: 40px;
          height: 30px;
          background-color: #f00;
          color: #fff;
          text-align: center;
          line-height: 30px;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
