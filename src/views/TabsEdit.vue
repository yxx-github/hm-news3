<template>
  <div>
    <!-- 头部 -->
    <hm-header>栏目管理</hm-header>

    <div class="container">
      <!-- 点击删除 -->
      <div class="title">点击删除一个频道</div>
      <div class="list">
        <div class="item" v-for="tab in activeTabs" :key="tab.id">
          <div @click="delTab(tab.id)">{{tab.name}}</div>
        </div>
      </div>
      <!-- 点击添加 -->
      <div class="title">点击添加一个频道</div>
      <div class="list">
        <div class="item" v-for="tab in deactiveTabs" :key="tab.id">
          <div @click="addTab(tab.id)">{{tab.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTabs: [], //上面的数组
      deactiveTabs: [] // 下面的数组
    }
  },
  created() {
    this.getTabs()
  },
  watch: {
    activeTabs(newValue) {
      // 保存到本地
      localStorage.setItem('activeTabs', JSON.stringify(newValue))
      localStorage.setItem('deactiveTabs', JSON.stringify(this.deactiveTabs))
    }
  },
  methods: {
    // 获取栏目列表
    async getTabs() {
      // 先尝试从本地获取
      let activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
      let deactiveTabs = JSON.parse(localStorage.getItem('deactiveTabs'))
      if (activeTabs && deactiveTabs) {
        this.activeTabs = activeTabs
        this.deactiveTabs = deactiveTabs
        return
      }

      let res = await this.$axios.get('/category')
      if (res.data.statusCode === 200) {
        this.activeTabs = res.data.data
      }
    },
    // 删除
    delTab(id) {
      // 1. 根据id找到对应的栏目
      // 2. 先添加到下面数组
      // 3.再从上面删除
      let tab = this.activeTabs.find(v => v.id === id)
      this.deactiveTabs.push(tab)
      this.activeTabs = this.activeTabs.filter(v => v.id !== id)
    },
    // 添加
    addTab(id) {
      // 1. 根据id找到对应的栏目
      // 2. 先添加到下面数组
      // 3.再从上面删除
      let tab = this.deactiveTabs.find(v => v.id === id)
      this.activeTabs.push(tab)
      this.deactiveTabs = this.deactiveTabs.filter(v => v.id !== id)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 20px;
  .title {
    font-size: 20px;
    line-height: 35px;
    height: 35px;
    font-weight: 700;
    margin-top: 10px;
  }
  .list {
    // background: #ddd;
    display: flex;
    flex-wrap: wrap;
    .item {
      height: 40px;
      width: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      div {
        height: 80%;
        width: 80%;
        background: #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
</style>
