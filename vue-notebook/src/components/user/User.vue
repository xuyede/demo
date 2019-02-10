<template>
    <div class="user">
        <div class="user-title">
            <div class="img">
                <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2377648370,2518817011&fm=26&gp=0.jpg" alt="">
            </div>
            <p class="user-name">{{ $store.state.username }}</p>
            <button @click="handleLoginOut">退出</button>
        </div>
        <div class="user-content">
            <ul class="content-nav">
                <router-link tag="li" :to="{name : 'OrderLink'}">订单信息</router-link>
                <router-link tag="li" :to="{name : 'DetailsLink'}">个人信息</router-link>
                <router-link tag="li" :to="{name : 'CollectLink'}">收藏列表</router-link>
                <router-link tag="li" :to="{name : 'AddressLink'}">地址管理</router-link>
                <router-link tag="li" :to="{name : 'UserCommentLink'}">商品评价</router-link>
                
            </ul>
            <router-view class="content-view"></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            order : true,
            details : false,
            collect : false,
            address : false,
            comment : false
        }
    },
    methods : {
        
        handleLoginOut() {
            this.$axios.get('/api/user/logout')
                .then(resp => {
                    if (resp.data.Code == this.$store.state.isSuccessResp) {
                        this.$message({
                            message: '退出账号成功!',
                            type: 'success',
                            duration : 1500
                        });
                        window.sessionStorage.setItem('isLogin', 0)
                        this.$store.state.cartList = []
                        this.$store.commit('changeIsLogin', !!+(window.sessionStorage.getItem('isLogin')))
                        this.$router.push({name : 'HomeLink'})
                    }
                })
        },
       
    },
    mounted() {
        if (!this.$store.state.isLogin) {
            console.log(111)
            alert('请先登录')
            this.$router.push({name : 'HomeLink'})
            return
        }
    },
};
</script>

<style scoped lang='stylus'>
    .router-link-active
        border-bottom 2px solid orange
        color orange !important 
    .user
        position absolute
        top 110px;
        left 50%
        width 80%
        transform translateX(-50%)
        z-index -1

        .user-title
            display flex
            flex-flow nowrap column
            justify-content center 
            align-items center
            height 150px
            width 100%
            background-color #eee
            margin-bottom 20px
            button
                width 50px
                height 25px
                background-color #333
                color #ffffff
                line-height 25px
                text-align center
                outline none 
                border none
                border-radius 5px
                margin-top 10px
                cursor pointer
                font-size 14px
            .img
                width 60px
                height 60px
                border-radius 50%
                overflow hidden
                img 
                    width 100%
            .user-name
                font-size 14px
                font-weight bold
                color #333
                margin-top 10px   

        .user-content
            display flex
            flex-flow nowrap row
            justify-content space-between
            align-items flex-start
            width 100%
            background-color rgb(246, 246, 246)
            .content-nav
                flex 1
                background-color #eee
                padding 10px 10px
                box-sizing border-box   
                li
                    position relative
                    height 46px
                    width 100%
                    text-align center
                    line-height 36px
                    padding 5px
                    font-size 16px
                    font-weight bold
                    cursor pointer
                    box-sizing border-box
                    &:hover
                        color orange
                
            .content-view
                flex 4
                background-color #eee
                margin-left 20px
                min-height 204px
                // padding 15px
                box-sizing border-box


</style>