<template>
  <div>
    <hm-header>我的收藏</hm-header>
    <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
  </div>
</template>

<script>
export default {
  data() {
    return {
      postList: []
    }
  },
  async created() {
    let res = await this.$axios.get('/user_star')
    if (res.data.statusCode === 200) {
      this.postList = res.data.data
    }
  }
}
</script>

<style>
</style>
