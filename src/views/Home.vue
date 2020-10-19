<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="right" @click="$router.push('/user')">
        <i class="iconfont iconwode"></i>
      </div>
    </div>

    <!-- 小三角 -->
    <van-sticky z-index="999">
      <div class="container" @click="$router.push('/tabsedit')">
        <i class="iconfont iconjiantou1"></i>
      </div>
    </van-sticky>

    <!-- tab标签栏 -->
    <van-tabs v-model="active" sticky>
      <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh" success-text="刷新成功">
          <!-- 分页 -->
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            :immediate-check="false"
            finished-text="没有更多了"
          >
            <hm-post
              @click.native="$router.push(`/detail/${post.id}`)"
              v-for="(post,index) in postList"
              :key="index"
              :post="post"
            ></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1, // tab栏当前激活的索引值
      tabList: [], // 栏目列表
      postList: [], // 文章列表
      pageIndex: 1, //当前页码
      pageSize: 5, // 每页条数
      loading: false, //是否在上一次的加载中
      finished: false, // 是否全部加载完成
      isRefreshing: false // 是否正在下拉刷新中 为 false => 说明刷新完成
    }
  },
  watch: {
    // 只要active变了 就说明切换了 tab
    active(newActive) {
      // 处理之前的数据
      this.postList = []
      this.pageIndex = 1

      // 处理加载
      this.finished = false
      this.loading = true

      // 监听索引 => 新的索引对应新的栏目id => 重新发送请求 获取对应的文章数据
      this.getPostList(this.tabList[newActive].id)
    }
  },
  created() {
    this.getTabsList()
  },
  methods: {
    // 获取栏目列表
    async getTabsList() {
      let res = await this.$axios.get('/category')
      if (res.data.statusCode === 200) {
        this.tabList = res.data.data
        console.log('栏目列表', res.data.data)
        // 请求成功后，才会有 tabList, 才会有id 根据 id获取对应的文章列表
        this.getPostList(this.tabList[this.active].id)
      }
    },
    // 获取文章列表
    async getPostList(id) {
      let res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      if (res.data.statusCode === 200) {
        // 拼接数据
        this.postList = [...this.postList, ...res.data.data]

        // 数据更新完毕将 loading 改成 false
        this.loading = false

        // 数据更新完毕 将 isRefreshing 改成 false 说明下拉刷新完成·
        this.isRefreshing = false

        // 如果全部加载完成,将 finished 改成 true
        if (res.data.data.length < this.pageSize) {
          this.finished = true
        }
        console.log('文章列表', this.postList)
      }
    },
    // 触底加载
    onLoad() {
      console.log('触底')
      this.pageIndex++
      this.getPostList(this.tabList[this.active].id)
    },
    // 下拉刷新
    onRefresh() {
      console.log('下拉')
      // 1.处理之前的数据
      this.postList = []
      this.pageIndex = 1

      // 2.处理加载
      this.finished = false
      this.loading = true // 防止自动触发一次底部  上一页触底了, 进入到下一页会自动触发

      // 3.重新请求
      this.getPostList(this.tabList[this.active].id)
    },
    fn() {
      console.log(1)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-tabs__nav {
  background-color: #ddd;
  margin-right: 40px;
  position: relative;
}
.header {
  height: 40px;
  background-color: #f00;

  display: flex;
  align-items: center;
  text-align: center;
  color: #fff;

  .left,
  .right {
    width: 60px;
  }
  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 24px;
  }
  .iconsearch {
    margin-right: 8px;
  }
  .center {
    flex: 1;
    background: rgba(255, 255, 255, 0.5);
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
  }
}
// 小三角
.container {
  position: absolute;
  right: 0;
  z-index: 999;
  width: 40.5px;
  height: 44px;
  background-color: #ddd;
  text-align: center;
  line-height: 44px;
}
</style>
