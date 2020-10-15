<template>
  <div>
    <!-- 头部 -->
    <hm-header>我的关注</hm-header>
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$axios.defaults.baseURL + item.head_img" alt>
        </div>
        <div class="center">
          <div class="nickname">{{item.nickname}}</div>
          <div class="date">{{item.create_date}}</div>
        </div>
        <div class="right" @click="unfollow(item.id)">取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getFollowList()
  },
  methods: {
    // 获取关注信息
    async getFollowList() {
      let res = await this.$axios.get('/user_follows')
      // console.log(res.data.data)
      if (res.data.statusCode === 200) {
        this.list = res.data.data
      }
    },
    // 取消关注
    async unfollow(id) {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '您确定要取消关注吗？'
        })
        let res = await this.$axios.get(`/user_unfollow/${id}`)
        if (res.data.statusCode === 200) {
          this.$toast.success(res.data.message)
          this.getFollowList()
        } else {
          this.$toast.fail(res.data.message)
        }
      } catch (error) {
        console.log('取消')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  .item {
    height: 90px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .left {
      img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .center {
      flex: 1;
      padding-left: 20px;
      height: 50px;
      line-height: 25px;
      .nickname {
        font-size: 14px;
      }
      .date {
        color: #999;
      }
    }
    .right {
      background-color: #ddd;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      border-radius: 15px;
    }
  }
}
</style>
