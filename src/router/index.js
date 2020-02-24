import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import manageHome from '../views/manageHome.vue'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/manageHome',
    name: 'manageHome',
    component: manageHome
  },
]

const router = new VueRouter({
  routes
})

export default router
