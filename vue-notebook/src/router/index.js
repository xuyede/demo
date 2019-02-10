import Vue from 'vue'
import Router from 'vue-router'
// Home
const HomePage = () => import('@/components/home/Home')
// Register
const RegisterPage = () => import('@/components/login&register/Register')
// Shop
const ShopPage = () => import('@/components/shop/Shop')
// Product
const ProductPage = () => import('@/components/product/Product')
const CommentPage = () => import('@/components/product/Comment')
const ConfigPage = () => import('@/components/product/Config')
// User
const UserPage = () => import('@/components/user/User')
const DetailsPage = () => import('@/components/user/Details')
const CollectPage = () => import('@/components/user/Collect')
const AddressPage = () => import('@/components/user/Address')
const UserCommentPage = () => import('@/components/user/Comment')
const OrderPage = () => import('@/components/user/order/Order')
  // Order
  const AllOrderPage = () => import('@/components/user/order/AllOrder')  
  const WaitDeliveryPage = () => import('@/components/user/order/WaitDelivery')  
  const WaitEnterPage = () => import('@/components/user/order/WaitEnter')
  const OrderDetailPage = () => import('@/components/user/order/OrderDetail')
// Pay
const PayPage = () => import('@/components/pay/Pay')
const PaySuccessPage = () => import('@/components/pay/PaySuccess') 
// Err
const ErrPage = () => import('@/components/err/Err')


Vue.use(Router)

export default new Router({
  routes: [
    {
      // 主页路由
      path: '/home',
      name: 'HomeLink',
      component: HomePage
    },
    {
      // 商城路由
      path: '/shop',
      name: 'ShopLink',
      component: ShopPage
    },
    {
      // 支付路由
      path: '/pay',
      name: 'PayLink',
      component: PayPage
    },
    {
      // 支付成功
      path: '/paySuccess',
      name: 'PaySuccessLink',
      component: PaySuccessPage
    },
    {
      // 用户界面路由
      path: '/user',
      name: 'UserLink',
      component: UserPage,
      redirect: '/user/order',
      children : [
        {
          // 用户订单路由
          path: 'order',
          name: 'OrderLink',
          component: OrderPage,
          redirect : {name : 'AllOrderLink'},
          children : [
            {
              // 全部订单路由
              path : 'allOrder',
              name : 'AllOrderLink',
              component : AllOrderPage
            },
            {
              // 待发货路由
              path : 'waitDelivery',
              name : 'WaitDeliveryLink',
              component : WaitDeliveryPage
            },
            {
              // 待收货路由
              path : 'waitEnter',
              name : 'WaitEnterLink',
              component : WaitEnterPage
            },
          ]
        },
        {
          // 用户个人信息路由
          path: 'details',
          name: 'DetailsLink',
          component: DetailsPage
        },
        {
          // 用户收藏路由
          path: 'collect',
          name: 'CollectLink',
          component: CollectPage
        },
        {
          // 用户地址路由
          path: 'address',
          name: 'AddressLink',
          component: AddressPage
        },
        {
          // 用户评论路由
          path: 'comment',
          name: 'UserCommentLink',
          component: UserCommentPage,
          beforeEnter: (to, from, next) => {
            // ...
            if (window.confirm('跳转')) {
              next()
            }
            next(false)
          }
        }
      ]
    },
    {
      // 订单详情
      path : '/order-detail/:id',
      name : 'OrderDetailLink',
      component : OrderDetailPage
    },
    {
      // 注册路由
      path: '/register',
      name: 'RegisterLink',
      component: RegisterPage
    },
    {
      // 错误页面重定向页面
      path: '/err.html',
      name: 'ErrLink',
      component: ErrPage
    },
    {
      // 商品细节路由
      path: '/product/:id',
      name: 'ProductLink',
      component: ProductPage,
      redirect: {name : 'ConfigLink'},
      children: [
        {
          // 评价路由
          path: 'comment',
          name: 'CommentLink',
          component: CommentPage
        },
        {
          // 电脑配置详情路由
          path: 'config',
          name: 'ConfigLink',
          component: ConfigPage
        },
      ]
    },
    {
      path : '*',
      // redirect : {name : "HomeLink"}
      redirect(to) {
        console.log(to)
        // /static/index.html
        // /index.html
        if (to.path == '/') {
          return { name : 'HomeLink'}
        } else {
          return { name : 'ErrLink'}
        }
      }
    }
  ],
  mode : 'history'
})