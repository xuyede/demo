<template>
    <div class="register">
        <div class="register-title">
            <span>注册账号</span>
            <div>
                <span>我已注册,现在就</span>
                <button class="register-login-btn" @click="$store.state.displayLogin = true">登录</button>    
            </div> 
        </div>     
        <div class="register-inp">
            <div>
                <label for="username">用户名</label> 
                <input id="username" type="text" placeholder="请设置用户名" autofocus
                    @focus="displayUserSpan = true" 
                    @blur="displayUserSpan = false"
                    @input="handleUser"
                > 
                <span class="username-message" v-if="isDisplayUserSpan">设置后不可更改 , 最短6个字母最长14个字母</span>
                <span class="iconfont" v-else-if="isUserExist">&#xe670;用户名已存在</span>
                <span class="iconfont" v-else-if="isUserFailed">&#xe670;不能为空或格式错误</span>
                <span class="iconfont" v-else-if="isUserSuccess">&#xe66f;</span>
            </div>
            <div>
                <label for="tele">手机号</label> 
                <input id="tele" type="text" placeholder="用于登录或找回密码"
                    @focus="displayTelSpan = true" 
                    @blur="displayTelSpan = false"
                    @input="handleTel"
                > 
                <span class="tel-message"  v-if="isDisplayTelSpan">请输入中国大陆手机号</span>
                <span class="iconfont" v-else-if="isTelExist">&#xe670;手机号已存在</span>
                <span class="iconfont" v-else-if="isTelFailed">&#xe670;不能为空或格式错误</span>
                <span class="iconfont" v-else-if="isTelSuccess">&#xe66f;</span>
            </div>
            <div>
                <label for="password">密码</label> 
                <input id="password" type="password" placeholder="请设置登录密码"
                    @focus="displayPwdSpan = true" 
                    @blur="displayPwdSpan = false"
                    @input="handlePwd"
                > 
                <span class="password-message"  v-if="isDisplayPwdSpan">字母或者数字开头，区分大小写，最短8位最长16位</span>
                <span class="iconfont" v-else-if="isPwdSuccess">&#xe66f;</span>
                <span class="iconfont" v-else-if="isPwdFailed">&#xe670;不能为空或格式错误</span>
            </div>
            <div>
                <label for="password-2">确认密码</label> 
                <input id="password-2" type="password" placeholder="请确认登录密码" @input="handleRePwd"> 
                <span class="iconfont"  v-show="displayRePwdSpan">&#xe66f;</span>
            </div>
            <div class="canvas">
                <label for="security">验证码</label>
                <input id="security" type="text" placeholder="请输入验证码" @input="handleCode">
                <div class="canvas-box" @click="handleReset">
                    <canvas ref="canvasCaptcha" width="80" height="40"></canvas>
                </div>
                <span class="securiry-message iconfont"  v-show="displayCodeSpan">&#xe66f;</span>
            </div>
            <div>
                <el-button 
                    :plain="true"
                    class="register-btn" 
                    :disabled="btnDisabled" 
                    :style="[btnDisabled ? disAbledStyle : '']" 
                    @click="handleRegister"
                >
                    注册
                </el-button>
            </div>
        </div>   
    </div>
</template>

<script>
import securityCode from '@/util/securityCode'

export default {
    data () {
        return {
            btnDisabled : true,
            disAbledStyle : {
                cursor : 'not-allowed'
            },
            firstPwd : '',
            codeVal : '',
            registerData : {},

            successcount : 0,
            
            displayUserSpan : false,
            userSuccess : false,
            userFailed : false,
            userExist : false,

            displayTelSpan : false,
            telSuccess : false,
            telFailed : false,
            telExist : false,

            displayPwdSpan : false,
            pwdSuccess : false,
            pwdFailed : false,

            displayRePwdSpan : false,
            rePwdSuccess : false,

            displayCodeSpan : false,
            codeSuccess : false,

            userTimer : null,
            telTimer : null,
        }
    },
    watch : {
        successcount() {
            const check = [this.userSuccess, this.telSuccess, this.pwdSuccess, this.rePwdSuccess, this.codeSuccess]
            if (check.every(item => item === true)) {
                this.btnDisabled = false
            }
        }
    },
    computed : {
        isDisplayUserSpan() {
            return (this.displayUserSpan == true && this.userSuccess == false && this.userFailed == false)
        },
        isUserExist() {
            return (this.userExist == true)
        },
        isUserSuccess() {
            return (this.userSuccess == true && this.userFailed == false)
        },
        isUserFailed() {
            return (this.userSuccess == false && this.userFailed == true)
        },
        
        isDisplayTelSpan() {
            return (this.displayTelSpan == true && this.telSuccess == false && this.telFailed == false)
        },
        isTelExist() {
            return (this.telExist == true)
        },
        isTelSuccess() {
            return (this.telSuccess == true && this.telFailed == false)
        },
        isTelFailed() {
            return (this.telSuccess == false && this.telFailed == true)
        },

        isDisplayPwdSpan() {
            return (this.displayPwdSpan == true && this.pwdSuccess == false && this.pwdFailed == false)
        },
        isPwdSuccess() {
            return (this.pwdSuccess == true && this.pwdFailed == false)
        },
        isPwdFailed() {
            return (this.pwdSuccess == false && this.pwdFailed == true)
        },
    },
    methods : {
        handleReset() {
            securityCode(this.$refs.canvasCaptcha)
        },
        handleUser(e) {
            clearTimeout(this.userTimer)
            this.userTimer = setTimeout(() => {
                const val = e.target.value
                const reg = /^[a-zA-Z0-9]{6,14}$/
                this.$axios.post('/api/user/check_username', { username : val})
                    .then(res => {
                        reg.test(val) ? 
                        (this.userSuccess = true, this.userFailed = false, this.successcount++, this.registerData['username'] = val):
                        (this.userSuccess = false, this.userFailed = true)

                        res.data.Code == 204 ?
                        this.userExist = true :
                        this.userExist = false
                        
                    })
            }, 1000);
        },
        handleTel(e) {
            clearTimeout(this.telTimer)
            this.telTimer = setTimeout(() => {
                const val = e.target.value
                const reg = /^1[3|4|5|8][0-9]\d{8}$/

                this.$axios.post('/api/user/check_telphone', { telphone : val})
                    .then(res => {

                        reg.test(val) ? 
                        (this.telSuccess = true, this.telFailed = false, this.successcount++, this.registerData['telphone'] = val):
                        (this.telSuccess = false, this.telFailed = true)

                        res.data.Code == 210 ?
                        this.telExist = true :
                        this.telExist = false
                    })
            }, 1000);
        },
        handlePwd(e) {
            const val = e.target.value
            this.firstPwd = val
            const reg = /^[a-zA-Z0-9_\.]{8,16}$/
            reg.test(val) ? 
            (this.pwdSuccess = true, this.pwdFailed = false, this.successcount++, this.registerData['password'] = val):
            (this.pwdSuccess = false, this.pwdFailed = true)
        },
        handleRePwd(e) {
            const val = e.target.value
            val === this.firstPwd ?
            (this.displayRePwdSpan = true, this.rePwdSuccess = true, this.successcount++, this.registerData['repassword'] = val) :
            (this.displayRePwdSpan = false, this.rePwdSuccess = false)
        },
        handleCode(e) {
            const val = e.target.value
            val === (this.codeVal).toLowerCase() ?
            (this.displayCodeSpan = true, this.codeSuccess = true, this.successcount++) :
            (this.displayCodeSpan = false, this.codeSuccess = false)
        },
        handleRegister () {
            this.$axios.post('/api/user/register', this.registerData)
                .then(this.dealRegisterResp)
        },
        dealRegisterResp (res) {
            if (res.data.Code == this.$store.state.isSuccessResp) {
                this.$message({
                    showClose: true,
                    message: '注册成功,请登录',
                    type: 'success',
                    duration: 1000
                });
                this.$router.push({name : 'HomeLink'})
            }
        }
    },
    mounted() {
        this.codeVal = securityCode(this.$refs.canvasCaptcha)
    }
};
</script>

<style scoped lang='stylus'>
    .register
        position absolute
        top 110px;
        left 50%
        width 80%
        transform translateX(-50%)
        z-index -1

        .register-title
            height 40px
            width 100%
            overflow hidden
            line-height 40px
            font-size 12px
            margin-bottom 50px
            box-shadow 0 2px 5px -3px rgba(0,0,0,0.1)
            & > :nth-child(1)
                float left
                font-size 25px
                font-weight 600
                color #999
            & > :nth-child(2)
                float right

            .register-login-btn
                padding 5px 15px
                font-size 12px
                color #333
                border-radius 5px
                box-shadow 0 0 0px 1px rgba(0,0,0,.3)
                border none
                margin-right 5px
                margin-left 5px
                cursor pointer
                &:hover
                    background-color #ccc

        .register-inp 
            width 1000px
            .canvas
                position relative

                .securiry-message
                    position absolute
                    top 50%
                    left 300px
                    transform translateY(-50%)
                input 
                    width 110px
                    margin-right 10px

                .canvas-box
                    position absolute
                    top 0
                    left 220px                
                    canvas 
                        cursor pointer

            & > div
                width 80%
                height 40px
                margin-bottom 20px
                font-size 0
                label 
                    display inline-block
                    width 80px
                    height 100%
                    line-height 40px
                    text-align right
                    color #999
                    font-size 16px
                    font-weight bold 
                    margin-right 15px

                input
                    height 100%
                    width 350px
                    border none
                    outline none
                    padding 0 10px
                    box-sizing border-box
                    box-shadow 0 0 2px 1px rgba(0,0,0,.3)
                    border-radius 5px
                    &:hover
                        box-shadow 0 0 10px 1px rgba(0,0,0,.3)

                span 
                    display inline-block
                    vertical-align top
                    height 40px
                    color orange
                    font-size 12px
                    line-height 40px
                    margin-left 10px

                .register-btn
                    margin-left 95px
                    width 350px;
                    height 100%
                    border none 
                    outline none
                    background-color #444
                    cursor pointer
                    color #f0f0f0
                    font-size 16px
                    font-weight bold
                    border-radius 5px
                    &:hover
                        background-color #333
                
</style>