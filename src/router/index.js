import Vue from 'vue'
import VueRouter from 'vue-router'


const Login =()=> import ('@/components/login.vue')

const Home =()=> import ('@/components/home.vue')

const Users =()=> import ('@/components/users.vue')

const Rights =()=> import ('@/components/rights.vue')

const Roles =()=> import ('@/components/roles.vue')

const Goodlist =()=> import ('@/components/goodslist.vue')

const Goodsadd =()=> import ('@/components/goodsadd.vue')

const Cateparams =()=> import ('@/components/cateparams.vue')

const Goodscate =()=> import ('@/components/goodscate.vue')

const Order =()=> import ('@/components/order.vue')

const Reports =()=> import ('@/components/reports.vue')




Vue.use(VueRouter)

export default new VueRouter({
  routes: [{
      name: "home",
      path: '/',
      component: Home,
      children: [{
          name: "users",
          path: '/users',
          component: Users
        }, {
          name: "rights",
          path: '/rights',
          component: Rights
        }, {
          name: "roles",
          path: '/roles',
          component: Roles
        }, {
          name: "goods",
          path: '/goods',
          component: Goodlist
        }, {
          name: "goodsadd",
          path: '/goodsadd',
          component: Goodsadd
        },
        {
          name: "params",
          path: '/params',
          component: Cateparams
        },
        {
          name: 'categories',
          path: '/categories',
          component: Goodscate
        },
        {
          name: 'orders',
          path: '/orders',
          component: Order
        },
        {
          name: 'reports',
          path: '/reports',
          component: Reports
        }
      ]
    },
    {
      name: "login",
      path: '/login',
      component: Login
    }
  ]
})
