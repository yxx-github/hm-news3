<template>
  <div>
    <!-- 头部 -->
    <hm-header>我的跟帖</hm-header>
    <!-- 列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <div class="item" v-for="item in list" :key="item.id">
        <div class="date">{{item.create_date | date}}</div>
        <div class="parent" v-if="item.parent">
          <div class="parent-nickname">回复：{{item.parent.user.nickname}}</div>
          <div class="parent-content">{{item.parent.content}}</div>
        </div>
        <div class="content">{{item.content}}</div>
        <div class="post">
          <div class="title line1">{{item.post.title}}</div>
          <i class="iconfont iconjiantou1"></i>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [], // 跟帖列表信息
      loading: false, // 本次加载完成 可以进行下次加载
      finished: false, // 是否全部加载完成
      pageIndex: 1,
      pageSize: 5
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      let res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      // console.log(res.data)
      if (res.data.statusCode === 200) {
        this.loading = false
        if (res.data.data.length < this.pageSize) {
          // 全部加载完成
          this.finished = true
        }
        this.list = [...this.list, ...res.data.data]
      } else {
        this.$toast.fail(res.data.message)
      }
    },
    onLoad() {
      this.pageIndex++
      this.getCommentList()
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .date {
    color: #999;
  }
  .parent {
    background-color: #ddd;
    padding: 10px;
    color: #999;
    &-nickname {
      height: 20px;
      line-height: 20px;
    }
    &-content {
      font-size: 14px;
    }
  }
  .content {
    font-size: 14px;
    padding: 10px 0;
  }
  .post {
    display: flex;
    color: #999;
    .title {
      flex: 1;
    }
    .iconjiantou1 {
      width: 20px;
      text-align: center;
    }
  }
}
</style>
