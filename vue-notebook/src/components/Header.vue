<template>
    <div>
        <header id="home-header">
            <div class="logo">
                <img src="@/assets/img/logo.png" alt="">
            </div>
            <!-- <div class="logo">
                
            </div> -->
            <ul class="nav">
                <router-link tag="li" :to="{name : 'HomeLink'}">首页</router-link>
                <router-link tag="li" :to="{name : 'ShopLink'}">商城</router-link>
            </ul>
            <ul class="fun">
                <li 
                    class="header-search" 
                    @mouseenter="handleSearchEnter"
                    @mouseleave="handleSearchLeave"
                >
                    <span class="iconfont">&#xe658;</span>
                </li>

                <li @click="handleLogin" v-if="hasLogin"><em>登录</em></li>
                <router-link tag="li" :to="{name : 'UserLink'}" v-else><em>{{ $store.state.username }}</em></router-link>

                <li class="header-shopcart"
                    @click="handleCartClick"
                >
                    <span class="iconfont">&#xe600;</span>
                </li>
            </ul>
            <!-- 搜索 -->
            <div 
                class="home-search-inp"
                :class="{active : moveSearch, marginLeft : isLoginStyle}"
                @mouseenter="handleSearchEnter" 
                @mouseleave="handleSearchLeave"
            >
                <input type="text" class="search-inp" placeholder="请输入搜索的内容" v-model="value" @input="handleInput"> 
                <div class="inp-icon iconfont">&#xe658;</div>
                <ul class="search-content" :class="{ haveItem : isDisplay }">
                    <li
                        v-for="(item, index) in searchArr"
                        :key="index"
                        @click="handle2Product(item)"
                    >
                        <div class="search-content-img">
                            <img :src="item.images[0]" alt="">
                        </div>
                        <span class="search-product-name">
                            {{ item.name }}
                        </span>
                        <span class="search-profuct-detail">
                            详情 >
                        </span>
                    </li>
                </ul>
            </div>
            <!-- 购物车 -->
            <cart :class="{active : displayCart}"></cart>
        </header>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
// import Cart from './shop/Cart'
const Cart = () => import('./shop/Cart')

export default {
    name : 'headerUtil',
    data () {
        return {
            moveSearch : false,
            value : '',
            timer : null,
            totalProductCount : 0,
            searchArr : [],
            isDisplay : false
        }
    },
    components : { Cart },
    computed : {
        ...mapState({
            displayLogin : 'displayLogin',
            displayCart : 'displayCart'
        }),
        isLoginStyle() {
            return this.$store.state.isLogin
        },
        hasLogin() {
            return !this.$store.state.isLogin
        }
    },
    methods : {
        handle2Product (item) {
            this.$router.push({ name : 'ProductLink', params : {id : item.commodity_id} })
        },
        // 获取全部商品
        getAllProduct () {
            this.$axios
                .get('/api/commodity/get')
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.totalProductCount = res.data.Data.shift().total_count
                        const dataArr = res.data.Data
                        const time = Math.floor(this.totalProductCount / 20)
                        let promises = []
                        // 添加到全部商品列表
                        this.$store.dispatch('asyncAddAllProduct', dataArr)
                        
                        for (let i = 1; i <= time; i++) {
                            promises.push(
                                this.$axios
                                    .get('/api/commodity/get?page=' + i)
                                    .then(res => {
                                        if (res.data.Code === this.$store.state.isSuccessResp) {
                                            const dataArr = res.data.Data.slice(1)
                                            this.$store.dispatch('asyncAddAllProduct', dataArr)
                                        }
                                    })
                            )
                        }

                        Promise.all(promises)
                            .then(res => {
                                console.log(this.$store.state.allProduct)
                            })
                        
                    }
                })
        },
        // 处理搜索功能
        handleInput () {
            if ( this.$store.state.allProduct.length == 0) {
                this.getAllProduct()
            }
            
            // 防抖操作
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.isDisplay = true
                // 数组扁平化
                const flatten = arr => arr.reduce( (baton, curVal) => baton.concat( Array.isArray(curVal) ? flatten(curVal) : [curVal] ), [])
                const flattenArr = flatten(this.$store.state.allProduct)
                flattenArr.forEach( item => {
                    item.name = item.name.toUpperCase()
                })
                this.$store.state.allProduct = flattenArr
                this.dealSearch()
            }, 1000);
        },
        // 处理筛选
        dealSearch () {
            if ( this.value == '' ) {
                this.searchArr = []
                this.isDisplay = false
                return
            }

            this.searchArr = this.$store.state.allProduct.filter( item => {
                
                if (item.name.indexOf(this.value.toUpperCase()) != -1) {
                    return item
                }

            })

            this.searchArr = this.searchArr.slice(0, 10)
        },
        handleLogin () {
            this.showLogin(!this.displayLogin)
        },
        ...mapMutations({
            showLogin : 'showLogin',
            showCart : 'showCart'
        }),
        handleSearchEnter() {
            this.moveSearch = true
        },
        handleSearchLeave() {
            this.moveSearch = false
        },
        handleCartClick() {
            this.showCart(!this.displayCart)
            if (this.displayCart && this.$store.state.isLogin) {
                this.getCartData()
            }
        },
        // 获取购物车数据
        getCartData () {
            this.$axios
                .get('/api/shopcart/get')
                .then(res => {
                    if (res.data.Code == this.$store.state.isSuccessResp) {
                        this.$store.state.cartList = res.data.Data
                    }
                })
            
        }
    },

};
</script>

<style scoped lang='stylus'>
    .router-link-active
        border-bottom 3px solid orange
        color orange !important 
    #home-header
        position fixed
        left 50%
        transform translateX(-50%)
        height 80px
        width 100%
        display flex
        justify-content space-around
        align-items center
        box-sizing border-box
        font-size 16px
        background-color rgb(246, 246, 246)
        transition all .3s
        z-index 99
        // box-shadow 0 5px 5px 0 rgba(0,0,0,.3)        

        .logo
            height 32px
            width 114px
            cursor pointer

            img 
                width 100%

        .nav, .fun
            overflow hidden

        .nav li 
            position: relative;
            float: left;
            margin-left: 70px;
            padding : 0 10px 10px 10px;
            box-sizing: border-box;
            color: #333;
            transition: transform .3s;
            cursor: pointer;
            font-weight: 600;

            &:hover
                color orange

            &:hover::after
                transform: scaleX(1);
                transform-origin: 0 100%;

            &::after
                content: '';
                position: absolute;
                bottom: -3px;
                left: 0;
                height: 3px;
                width: 100%;
                background-color: orange;
                transition: transform .3s;
                transform: scaleX(0);
                transform-origin: 100% 0;

        .fun li
            float: left;
            padding: 20px 15px;
            cursor pointer
            em
                display inline-block
                max-width 56px
                font-size 14px
                font-weight bold
                transition transform .3s
                transform translateY(0px)
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;

                &:hover
                    font-weight bold
                    transform translateY(-5px)

        .home-search-inp
            position: absolute;
            right: 18%;
            top: 50%;
            width: 400px;
            height: 45px;
            // box-shadow: 0 0 5px 2px rgba(0, 0, 0, .2)
            border 1px solid #333
            transition all .3s
            transform scaleX(0) translateY(-48%);
            transform-origin 100% 0
            opacity 0
            cursor pointer
            box-sizing border-box
            &.active
                opacity 1
                transform scaleX(1) translateY(-48%);
            &.marginLeft
                right: 20%;
        
            input 
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                padding-left: 20px;
                box-sizing: border-box; 
            .search-content
                position relative 
                width 100%
                height 500px
                z-index 100
                background-color #fff
                margin-top 10px
                display none
                overflow hidden
                &.haveItem
                    display block
                li
                    height 50px
                    width 100%
                    display flex
                    justify-content space-around
                    align-items center
                    &:hover
                        background-color #ddd
                    .search-content-img
                        width 30px
                        height 30px
                        img
                            width 100%
                            height 100%
                    .search-product-name
                        width 250px
                        font-size 12px
                        font-weight bold
                        white-space nowrap
                        overflow hidden
                        text-overflow ellipsis
                    .search-profuct-detail
                        font-size 10px
                        &:hover
                            color orange
                        
                    

            .inp-icon
                position absolute
                top 0
                right 0
                height 100%
                width 50px;
                line-height 45px;
                text-align center
                cursor pointer

</style>