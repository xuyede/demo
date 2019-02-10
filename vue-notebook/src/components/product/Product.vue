<template>
    <div 
        class="item-details" 
        v-if="imgUrlArr.length > 0"
        v-loading.fullscreen.lock="fullscreenLoading"
    >
        <div class="item-show">
            <div class="item-img-wall">
                <div class="img-box">
                    <img :src="bigImg" alt="">
                </div>
                <ul class="img-list">
                    <li v-for="(url, index) in imgUrlArr" @mouseenter="handleMouseEnter($event, index)" @mouseleave="handleMouseLeave">
                        <img :src="url" alt="">
                    </li>
                </ul>
            </div>
            <div class="item-detail">
                <div class="product-name">
                    <p>{{ productDetail.name }}</p>
                    <p>{{ productDetail.brand }}</p>
                </div>
                <div class="product-color">
                    <span>颜色 : <em>{{ productDetail.color }}</em> </span>
                    <el-rate
                        v-model="starValue"
                        disabled
                        text-color="#ff9900"
                        score-template="{value}">
                    </el-rate>
                </div>
                <div class="product-count">
                    数量 : 
                    <el-input-number 
                        v-model="num1" 
                        @change="handleChange" 
                        :min="1" 
                        :max="10" 
                        size='mini'
                        label="描述文字">
                    </el-input-number>
                    <div class="product-fun">
                        <el-button type="info" icon="el-icon-star-off" circle @click.native="handleAddCollect"></el-button>
                        <!-- <el-button type="info" class="iconfont" circle @click.native="handleAddCart">&#xe600;</el-button> -->
                    </div>
                </div>
                <div class="product-price">
                    价格 : ¥ {{ productDetail.price }}.00
                </div>
                <div class="buy">
                    <el-button type="info" @click.native="handleBugNow">立即购买</el-button>
                    <el-button type="info" @click.native="handleAddCart">加入购物车</el-button>
                </div>
            </div>
        </div>
        <div class="item-other">
            <ul class="fun-list">
                <router-link tag="li" :to="{name : 'ConfigLink'}">参数</router-link>
                <router-link tag="li" :to="{name : 'CommentLink'}">评论({{totleCommentNum}})</router-link>
            </ul>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            starValue: 4,  // 星星
            num1: 1,  // 购买数量
            productDetail : {},  // 商品信息
            imgUrlArr : [],  // 商品图片列表
            bigImg : '',  // 大图 url
            fullscreenLoading : false,  // 全屏加载
            totleCommentNum : 0,  // 评论数
        }
    },
    watch: {
        imgUrlArr () {
            this.fullscreenLoading = false
        }
    },
    watch: {
        $route () {
            const productNum = this.$route.params.id
            this.getProductDetail(productNum)
            this.getComment(productNum)
        }
    },
    methods : {
        // 鼠标移入小图事件处理
        handleMouseEnter(e, index) {
            const target = e.target
            target.classList.add('active')
            this.bigImg = this.imgUrlArr[index]
        },
        // 鼠标离开小图
        handleMouseLeave(e) {
            e.target.classList.remove('active')
        },
        // 购买数量
        handleChange(value) {
            console.log(value);
        },
        // 获取商品信息
        getProductDetail (productNum) {
            this.$axios.get('/api/commodity/get_detail?commodity_id=' + productNum)
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.productDetail = res.data.Data[0]
                        const imgs = this.productDetail.images
                        this.imgUrlArr = imgs.slice(0, 5)
                        this.bigImg = this.imgUrlArr[0]
                    }
                })
        },
        // 获取评论数
        getComment (productNum) {
            this.$axios
                .get('/api/comment/user/get?commodity_id=' + productNum)
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.totleCommentNum = res.data.Data[0].total_count
                    }
                })
        },
        // 收藏/加购前是否登录
        checkLogin () {
            // window.sessionStorage.getItem('isLogin')
            if (!this.$store.state.isLogin) {
                this.$message({
                    showClose: true,
                    message: '账号未登录,请先登录账号',
                    type: 'warning',
                    duration: 1500
                });
                return false
            }
            return true
        },
        // 添加到购物车
        handleAddCart () {
            if (!this.checkLogin()) {
                return
            }

            this.$axios
                .post('/api/shopcart/add', { commodity_id : this.productDetail.commodity_id, count : this.num1 })
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
        },
        // 添加收藏
        handleAddCollect () {
            if (!this.checkLogin()) {
                return
            }
            const data = {
	            "commodity_id" : this.productDetail.commodity_id
            }
            this.$axios
                .post('/api/collection/add', data)
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.$message({
                            showClose: true,
                            message: '已添加到收藏夹',
                            type: 'success',
                            duration: 1500
                        });
                    }
                })
        },
        // 立即购买
        handleBugNow () {
            if (!this.checkLogin()) {
                return
            }

            const data = {
                count : this.num1,
                id : this.productDetail.commodity_id
            }
            this.$router.push({name : 'PayLink', params : {sum : this.productDetail.price, chooseProduct : [data], flag: 'product'}})
        }
        
    },
    created() {
        const productNum = this.$route.params.id
        this.getProductDetail(productNum)
        this.getComment(productNum)
    },
};
</script>

<style scoped lang='stylus'>
    .router-link-active
        border-bottom 2px solid orange !important
    .item-details
        width 80%
        margin 0 auto
        .item-other
            margin-bottom 50px
            .fun-list
                overflow hidden
                text-align center
                li
                    display inline-block
                    margin-right 20px
                    font-size 16px
                    padding 10px 15px
                    box-sizing border-box 
                    border-bottom 2px solid transparent
                    box-sizing border-box
                    cursor pointer
        .item-show
            width 100%
            padding 0 90px
            box-sizing border-box
            text-align justify
            border-bottom 1px solid #ddd
            &::after
                content ''
                display inline-block
                width 100%
                height 0
            
            .item-detail
                display inline-block
                vertical-align top
                width 500px
                height 500px
                margin-top 110px
                padding 30px 0
                box-sizing border-box
                .product-name
                    & > :nth-child(1)
                        font-size 20px
                        font-weight bold
                    & > :nth-child(2)
                        font-size 14px
                        margin-top 5px
                        padding-bottom 30px
                    border-bottom 1px solid #ddd
                .product-color
                    padding 30px 0
                    font-size 14px
                    border-bottom 1px solid #ddd
                    span 
                        vertical-align top
                        line-height 14px
                    em
                        display inline-block
                        vertical-align top
                        margin-left 20px
                        font-size 12px
                        font-weight bold
                    .el-rate
                        position relative
                        display inline-block
                        font-size 14px
                        margin-left 200px
                        line-height 14px
                        z-index -1
                .product-count
                    font-size 14px
                    padding 30px 0
                    border-bottom 1px solid #ddd
                    .el-input-number
                        position relative
                        width 90px
                        margin-left 30px
                        z-index 1
                    .product-fun
                        display inline-block
                        margin-left 150px
                        .el-button 
                            width 25px
                            height 25px
                            line-height 15px
                            font-size 11px
                            text-align center
                            padding 0
                .product-price
                    padding 30px 0
                    font-size 18px
                    font-weight bold 
                    border-bottom 1px solid #ddd
                .buy
                    padding 30px 0
                    font-size 14px
                    border-bottom 1px solid #ddd
                    .el-button
                        width 90px
                        height 40px
                        line-height 40px
                        text-align center
                        padding 0
                        font-size 13px
                        font-weight bold

            .item-img-wall
                display inline-block
                vertical-align top
                width 400px
                height 500px
                margin-top 110px
                .img-box
                    width 100%
                    height 80%
                    img
                        width 100%
                        height 100%

                .img-list
                    height 20%
                    width 100%
                    li  
                        display inline-block
                        width 20%
                        height 80px
                        border 2px solid transparent
                        box-sizing border-box
                        img
                            width 100%
                            height 100%
                        &.active
                            border 2px solid orange
</style>