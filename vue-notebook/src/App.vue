<template>
  <div id="app">
    <header-page></header-page>
    <user-login v-show="displayLogin"></user-login>
    <router-view></router-view>
  </div>
</template>

<script>

// http://119.23.44.138:10001

import HeaderPage from '@/components/Header'
import UserLogin from '@/components/login&register/Login'

export default {
  name: 'App',
  components : { HeaderPage, UserLogin },
  computed : {
    displayLogin () {
      return this.$store.state.displayLogin
    }
  },
  mounted() {
    // window.sessionStorage.setItem('isLogin', false)
    // window.sessionStorage.setItem('username', '登录')
    // 页面刷新,根据 sessionStorage判断是否登录
    this.$store.commit('changeIsLogin', !!+(window.sessionStorage.getItem('isLogin')))
    this.$store.commit('changeUsername', window.sessionStorage.getItem('username'))
    

    document.onmousewheel = function () {
      document.onscroll = function () {
        const top = document.documentElement.scrollTop
        const style = document.getElementById('home-header').style
        if (top > 30) {
          style.boxShadow = '0 5px 5px 0px rgba(0,0,0,.3)'
          style.height = '70px'
        } else {
          document.getElementById('home-header').style.boxShadow = ''
          style.height = '80px'
        }
      }
    }
  },
}
</script>

<style lang='stylus' scoped>
  
</style>
