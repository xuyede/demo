<template>
    <div class="login-bg">
        <div class="login-center">
            <div class="iconfont login-delete" @click="handleDeleteLogin">&#xe66e;</div>
            <div class="login-title">
                <div class="login-logo">
                    <img src="@/assets/img/logo.png" alt="">
                </div>
                <div class="login-type">
                    <span>· 用户名密码登陆</span>
                </div>
            </div>
            <div class="login-inp">
                <input ref="inpUsername" class="inp-username" type="text" placeholder="手机/用户名" autofocus>
                <input ref="inpPassword" class="inp-password" type="password" placeholder="密码">
                <!-- <button class="btn" @click="handleLogin">登录</button> -->
                <el-button :plain="true" class="btn" @click="handleLogin">登录</el-button>
            </div>
            <div class="login-fun">
                <div>忘记密码?</div>
                <!-- <router-link tag="div" @click="handleDeleteLogin" class="register" :to="{name : 'RegisterLink'}">注册账号</router-link> -->
                <div class="register" @click="handle2Register">注册账号</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name : 'HomeLogin',
    data() {
        return {

        }
    },
    methods : {
        handleLogin() {
            const inps = Object.values(this.$refs)
            const [username, password] = inps.map(x => x.value)
            const loginData = {username, password}

            if (password == undefined || password.length < 8) {
                this.$message.error({
                    message : '用户名或密码错误',
                    duration : 1500
                });
                return
            }

            this.$axios
                .post('/api/user/login', loginData)
                .then(resp => {
                    if (resp.data.Code == 213) {
                        this.$message.error({
                            message : '用户名或密码错误',
                            duration : 1500
                        });
                    }

                    if (resp.data.Code == this.$store.state.isSuccessResp) {
                        this.$message({
                            showClose: true,
                            message: '登陆成功',
                            type: 'success',
                            duration: 1500
                        });
                        window.sessionStorage.setItem('isLogin', 1)
                        window.sessionStorage.setItem('username', resp.data.Data[0].username)
                        this.$store.commit('changeIsLogin', !!+(window.sessionStorage.getItem('isLogin')))
                        this.$store.commit('changeUsername', resp.data.Data[0].username)
                        this.$store.state.displayLogin = false
                    }
                })
            
        },
        handleDeleteLogin() {
            this.$store.state.displayLogin = false
        },
        handle2Register() {
            this.$router.push({name : 'RegisterLink'})
            this.$store.state.displayLogin = false
        }
    }
};
</script>

<style scoped lang='stylus'>
    .login-bg
        position relative
        width 100%
        height 100vh
        background-color rgba(0,0,0,.5)

        .login-center
            position absolute
            width 356px
            height 350px
            top 50%
            left 50%
            transform translate(-50%, -50%)
            background-color rgb(255, 255, 255)
            padding 40px 35px 20px 35px
            box-sizing border-box 

            .login-delete
                position absolute
                top 10px
                right 10px
                font-size 20px
                font-weight bold
                color #999
                cursor pointer


            .login-title
                height 50px
                width 100%
                overflow hidden

                div
                    float left

                .login-type
                    height 23px
                    line-height 23px
                    margin-left 10px
                    font-size 16px

                .login-logo
                    width 80px 
                    height 23px
                    img 
                        width 100%
                        
            .login-inp
                display flex
                flex-flow nowrap column
                justify-content flex-start
                width 100%
                height 180px

                .inp-username, .inp-password, .btn
                    height 42px
                .inp-username, .inp-password
                    margin-bottom 15px
                    border 1px solid #ccc
                    outline none
                    padding 0 10px
                .btn
                    outline none
                    border none
                    color #ffffff
                    font-weight bold
                    background-color #444
                    border-radius 5px 
                    cursor pointer

                    &:hover
                        background-color #333

            .login-fun
                width 100%
                height 20px
                overflow hidden

                div
                    float left
                    color rgb(255, 114, 0)
                    font-weight bold
                    font-size 12px 
                    cursor pointer

                    &:hover
                        color rgba(255, 114, 0, .7)

                .register
                    float right

                
                

                    



</style>