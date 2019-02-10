<template>
    <div id="home"> 
        <div class="home-swiper">
            <swiper :options="swiperOption">
                <swiper-slide><router-link tag="img" :to="{name : 'ProductLink', params: {id : 65}}" src="https://i1.mifile.cn/f/i/16/chain/milaptop/milaptop-03-av2.jpg"></router-link> </swiper-slide>
                <swiper-slide><router-link tag="img" :to="{name : 'ProductLink', params: {id : 61}}" src="https://i1.mifile.cn/f/i/18/gamelaptop//banner.jpg"></router-link> </swiper-slide>
                <swiper-slide><router-link tag="img" :to="{name : 'ProductLink', params: {id : 68}}" class="img" src="https://i1.mifile.cn/f/i/18/mibookair/13/index_light.jpg"></router-link> </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
        </div>
        <div class="home-recommend">
            <div class="recommend-content">
                <p class="host-list-title">推荐产品</p>
                <ul v-if="recommendList.length > 0" >
                    <li
                        v-if="recommendList.length > 0"
                        v-for="(item, index) in recommendList" 
                        :key="index"
                    >
                        <router-link 
                            tag="div"
                            class="recommend-img"
                            :to="{ name : 'ProductLink', params : {id : item.commodity_id} }"
                        >
                            <img :src="item.images[0]" alt="">
                        </router-link>
                        <div v-if="recommendList.length > 0" class="recommend-decoration">
                            <p>{{item.name}}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="home-host-list">
            <div class="host-list-content">
                <p class="host-list-title">热销产品</p>
                <ul class="host-list">
                    <li 
                        v-if="hostList.length > 0" 
                        v-for="(item, index) in hostList" 
                        :key="index"
                    > 
                        <router-link tag="div" :to="{ name : 'ProductLink', params : {id : item.commodity_id} }" class="item-img">
                            <img :src="item.images[0]" alt="">
                        </router-link> 
                        <div class="item-description">
                            <router-link tag="p" :to="{ name : 'ProductLink', params : {id : item.commodity_id} }">{{ item.name }}</router-link>
                            <h6>{{ item.brand }}</h6>
                            <h3>¥ {{ item.price }}</h3>
                        </div>
                        <div class="item-addCart" @click="handleAddCart(item)">
                            <span class="iconfont">&#xe600;</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="footer">
            team 9
        </div>
    </div>
</template>

<script>

export default {
    name : 'HomePage',
    data() {
        return {
            recommendList : [
                {
                    images : ['@/assets/img/fake.jpg'],
                    name : 'xuyede',
                    commodity_id : 201
                },
                {
                    images : ['@/assets/img/fake.jpg'],
                    name : 'xuyede',
                    commodity_id : 202
                },
                {
                    images : ['@/assets/img/fake.jpg'],
                    name : 'xuyede',
                    commodity_id : 203
                }
            ],
            hostList : [
                {
                    images : ['@/assets/img/fake.jpg'],
                    brand : 'xuyede',
                    name: 'xuyede',
                    commodity_id : 101,
                    price : 0
                },
                {
                    images : ['@/assets/img/fake.jpg'],
                    brand : 'xuyede',
                    name: 'xuyede',
                    commodity_id : 102,
                    price : 0
                },
                {
                    images : ['@/assets/img/fake.jpg'],
                    brand : 'xuyede',
                    name: 'xuyede',
                    commodity_id : 103,
                    price : 0
                },
                {
                    images : ['@/assets/img/fake.jpg'],
                    brand : 'xuyede',
                    name: 'xuyede',
                    commodity_id : 103,
                    price : 0
                }
            ],
            imgUrl :' @/assets/img/fake.jpg' ,
            swiperOption: {
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                loop : true
            }
        }
    },
    methods : {
        // 处理请求数据
        dealDetailData (data) {
            this.dealRecommendList( data.concat([]) )
            this.dealHostList( data.concat([]) )
        },
        // 处理推荐位数据
        dealRecommendList (list) {
            // 生成 3个不重复的随机数
            const randomNumList = new Set
            while (randomNumList.size < 3) {
                let randomNum = Math.floor( Math.random() * 21 )
                randomNumList.add(randomNum)
            }
            
            const targetList = []
            const originList = [...randomNumList]
            for (let i = 0; i < randomNumList.size; i++) {
                // 随机获取 3条数据放进推荐列表
                targetList[i] = list[originList[i]]
            }
            
            this.recommendList = targetList
        },
        // 处理热销位数据
        dealHostList (list) {
            const randomNum = Math.floor( Math.random() * 14 )
            // 随机截取 8个放进热销列表
            const targetList = list.slice(randomNum, randomNum + 8)
            this.hostList = targetList
        },
        // 加入购物车
        handleAddCart (productDetail) {
            // 检测是否为登录状态, 不是则提示
            // window.sessionStorage.getItem('isLogin')
            if (!this.$store.state.isLogin) {
                this.$message({
                    showClose: true,
                    message: '请先登录账号',
                    type: 'warning',
                    duration: 1500
                });
                return
            }
            this.$axios
                .post('/api/shopcart/add', { commodity_id : productDetail.commodity_id, count : 1 })
                .then(res => {
                    if (res.data.Code == this.$store.state.isSuccessResp) {
                        this.$message({
                            showClose: true,
                            message: '已添加到购物车',
                            type: 'success',
                            duration: 1500
                        });
                    }
                })
        }
    },
    created() {
        const requestPage = Math.floor( Math.random() * 11 )
        this.$axios
            .get('/api/commodity/get_detail/?page=' + requestPage)
            .then(res => {
                const productList20 = (res.data.Data).concat([]).slice(1)
                this.dealDetailData(productList20)
            })
    }
};
</script>

<style scoped lang='stylus'>
    .home-swiper >>> .swiper-container
        width 100%
        height 100%

    .swiper-container >>> .swiper-pagination-bullet-active
        background-color orange

    .swiper-slide
        img
            width 100%
            height 100%
        .img 
            width 100%
            height 100%
            text-align center
            line-height 538px
            color #333
            font-size 50px
            font-weight bolder
            cursor pointer
    .host-list-title
        font-size 20px
        font-weight bold
        padding-bottom 10px
        border-bottom 1px solid #ccc
        margin-bottom 50px 
    #home 
        overflow hidden
        position absolute
        top 110px;
        left 50%
        width 100%
        transform translateX(-50%)
        box-sizing border-box
        z-index -1
        .footer
            position relative
            height 200px
            width 100%
            line-height 200px
            text-align center
            font-size 30px
            font-weight bold
            background-color #fff
            &::after
                content ''
                position absolute
                width 100%
                top -50px
                left -1434px
                border-left: none;
                border-right: 1434px solid #fff;
                border-top:50px solid transparent;
                border-bottom: 50px solid transparent;
                z-index -1

        .home-host-list
            position relative
            width 100%
            margin-bottom 150px
            .host-list-content
                width 80%
                margin 0 auto
                .host-list
                    display flex
                    justify-content space-around
                    flex-flow wrap row
                    font-size 0
                    &::after
                        content ''
                        display inline-block
                        width 100%
                    li
                        display inline-block
                        width 23%
                        font-size 16px
                        border-radius 10px
                        overflow hidden
                        transition transform .3s
                        transform translateY(0)
                        margin-bottom 20px
                        &:hover
                            transform translateY(-24px)
                            .item-addCart
                                opacity 1
                                transform  translateY(0)
                                border-top 1px solid #ddd
                            .item-description
                                border-bottom-left-radius 0px
                                border-bottom-right-radius 0px
                        .item-img
                            width 100%
                            cursor pointer
                            img
                                width 100%
                        .item-description
                            padding 10px 30px
                            box-sizing border-box
                            background-color #fff
                            border-bottom-left-radius 10px
                            border-bottom-right-radius 10px
                            & > :nth-child(1)
                                width 200px
                                white-space nowrap
                                overflow hidden
                                text-overflow ellipsis
                            *
                                margin-bottom 10px
                            p
                                font-size 15px
                                font-weight bold
                                color #333
                                cursor pointer
                                &:hover
                                    color orange
                            h6
                                font-size 12px
                            h3 
                                font-size 20px
                        .item-addCart
                            position relative
                            height 42px
                            text-align center
                            line-height 42px
                            background-color #fff
                            border-bottom-left-radius 10px
                            border-bottom-right-radius 10px
                            transition all .3s
                            transform translateY(-50px)
                            opacity 0
                            cursor pointer
                            box-sizing border-box
                            z-index -1
                        

        .home-swiper
            width 100%
            height 538px
            cursor pointer

        .home-recommend
            position relative
            width 100%
            margin-top 130px
            margin-bottom 130px
            background-color #fff
            .recommend-content
                width 80%
                margin 0 auto 
                ul
                    display flex
                    justify-content space-around
                    align-items center
                    flex-flow nowrap row
                    font-size 0
                    padding-bottom 50px
                    // &::after
                    //     content ''
                    //     display inline-block
                    //     width 100%
                    li
                        position relative
                        display inline-block
                        width  30%
                        height 279px
                        box-sizing border-box
                        // box-shadow 0 0 2px 1px rgba(0,0,0,.3)
                        cursor pointer
                        overflow hidden
                       
                        .recommend-img
                            width 100%
                            height 100%
                            img 
                                transition all .3s
                                width 100%
                                height 100%
                                transform scale(1)
                                opacity 1
                                &:hover
                                    transform scale(1.2)
                                    opacity .7
                        .recommend-decoration
                            position absolute
                            width 100%
                            bottom 0px
                            left 0
                            font-size 15px
                            color #fff
                            background-color rgba(0,0,0, .6)
                            padding 10px 10px

                            & > :nth-child(1)
                                width 300px
                                white-space:nowrap;
                                overflow:hidden;
                                text-overflow:ellipsis
                                margin-bottom 5px
                                text-align left
                            
            &::before
                content ''
                position absolute
                width 100%
                bottom -50px
                left 0px
                border-left: 1434px solid #fff;
                border-right: none;
                border-top:50px solid transparent;
                border-bottom: 50px solid transparent;
                z-index -1
            &::after
                content ''
                position absolute
                width 100%
                top -50px
                left -1434px
                border-left: none;
                border-right: 1434px solid #fff;
                border-top:50px solid transparent;
                border-bottom: 50px solid transparent;
                z-index -1


</style>