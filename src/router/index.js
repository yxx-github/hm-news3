import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Edit from '../views/Edit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComment from '../views/MyComment.vue'
import MyStar from '../views/MyStar.vue'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit
    },
    {
      path: '/myfollow',
      component: MyFollow
    },
    {
      path: '/mycomment',
      component: MyComment
    },
    {
      path: '/mystar',
      component: MyStar
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// 全局前置守卫
router.beforeEach((to, from, next) => {
  const authPath = ['/user', '/edit', '/myfollow', '/mycomment', '/mystar']
  if (authPath.includes(to.path)) {

    let token = localStorage.getItem('token')

    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router