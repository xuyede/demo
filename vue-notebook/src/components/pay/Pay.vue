<template>
    <div class="pay">
        <div class="choose-address">
            <p >确认收货地址</p>
            <el-radio v-model="radio" :label="index" v-for="(item, index) in options" :key="index">{{ item.label }}</el-radio>
        </div>
        <div class="order-content">
            <p>确认订单信息</p>
            <ul class="order-list" v-if="productArr.length > 0">
                <li 
                    class="order-item"
                    v-for="(item, index) in productArr"
                    :key="index"
                >
                    <div class="item">
                        <div class="item-content">
                            <router-link 
                                class="order-img"
                                tag="div"
                                :to="{name : 'ProductLink', params : {id : item.commodity_id}}"
                            >
                                <img :src="item.images[0]" alt="">
                            </router-link>
                            <router-link
                                class="order-title"
                                tag="div"
                                :to="{name : 'ProductLink', params : {id : item.commodity_id}}"
                            >
                                {{ item.name }}
                            </router-link>
                            <div class="item-count">
                                <p>¥{{ item.price }}</p>
                                <p>数量:{{ item.count }}</p>
                            </div>
                            <div class="price">¥{{ item.price * item.count }}</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="enter-order" v-if="addressArr.length > 0">
            <p>实付款: <span>¥<em>{{ totalPrice }}</em></span></p>
            <p>寄送至: {{ addressArr[radio].address }}</p>
            <p>收货人: {{ addressArr[radio].recv_name }} {{ addressArr[radio].recv_telphone }}</p>
            <el-button size="mini" type="warning" @click.native="handleAddOrder">提交订单</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            productArr : [],
            addressArr : [],
            options: [],
            value: '',
            totalPrice : '',
            radio : 0
        }
    },
    watch: {
        // 选中的地址
        value () {  
            this.addressObj = this.addressArr[this.value]
        }
    },
    methods: {
        // 提交订单
        handleAddOrder () {
            // if (this.$route.params.flag === 'product') {
            //     let data = {
            //         "shopcart_id" : null,
            //         "address_id" : this.addressArr[this.radio].address_id,
            //         "commodity_id": item.commodity_id,
            //         "count": 1,
            //     }
            //     this.$store.commit('changeOrderMeg', data)
            // } else {
            //     let data = {
            //         "shopcart_id" : item.shopId,
            //         "address_id" : this.addressArr[this.radio].address_id
            //     }
            //     this.$store.commit('changeOrderMeg', data)
            // }


            // this.$store.commit('changePayList', this.productArr)
            // this.$store.commit('changePayAddress', this.addressArr)
            // this.$store.commit('changeRadio', this.radio)

            // /* 留支付接口 */
            // this.$axios
            //     .get('/api/pay/add?price=' + this.totalPrice)
            //     .then( res => {
            //         if (res.data.Code === this.$store.state.isSuccessResp) {
            //             const url = res.data.Data[0]
            //             // 跳转支付宝支付页面
            //             window.location.href = url.url
            //         }
            //     })
            
            
            let number = 0
            // 同步提交多个请求
            const promises = this.productArr.map( item => {
                // 兼容直接购买还是购物车结算
                if (this.$route.params.flag === 'product') {
                    let data = {
                        "shopcart_id" : null,
                        "address_id" : this.addressArr[this.radio].address_id,
                        "commodity_id": item.commodity_id,
	                    "count": 1,
                    }
                    this.$store.commit('changeOrderMeg', data)
                } else {
                    let data = {
                        "shopcart_id" : item.shopId,
                        "address_id" : this.addressArr[this.radio].address_id
                    }
                    this.$store.commit('changeOrderMeg', data)
                }
                
                // 添加订单
                return this.$axios
                    .post('/api/order/user/add', this.$store.state.orderMeg)
                    .then(res => {
                        console.log(res)
                        if (res.data.Code === this.$store.state.isSuccessResp) {
                            number ++
                        }
                    })
            })
            // 异步处理
            Promise.all(promises)
                .then(res => {
                    if (number == this.productArr.length) {
                        
                        /* 留支付接口 */
                        this.$axios
                            .get('/api/pay/add?price=' + this.totalPrice)
                            .then( res => {
                                if (res.data.Code === this.$store.state.isSuccessResp) {
                                    const url = res.data.Data[0]
                                    // 跳转支付宝支付页面
                                    window.location.href = url.url
                                }
                            })
                    }
                })
        },
            
        // 获取地址
        getAddress () {
            this.$axios
                .get('/api/address/get')
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        const AddressArr = res.data.Data
                        this.addressArr = AddressArr
                        this.options = AddressArr.map((item, index) => {
                            return {
                                value : `${index}`,
                                label : `${item.address} (${item.recv_name} 收) ${item.recv_telphone}`,
                                addressId : item.address_id
                            }
                        })
                        
                    }
                })
        },

        // 获取选择商品的信息
        getProductData () {
            const idArr = this.$route.params.chooseProduct
            let productArr = []
            this.totalPrice = this.$route.params.sum

            // 同步获取所有需要购买的商品
            let productPromises = idArr.map(item => {
                return this.$axios
                    .get('/api/commodity/get_detail?commodity_id=' + item.id)
                    .then(res => {
                        if (res.data.Code === this.$store.state.isSuccessResp) {
                            const data = res.data.Data[0]
                            data.count = item.count
                            data.shopId = item.shopCartId
                            productArr.push(data)
                        }
                    })
            })
            // 等全部异步执行完再赋值给全局变量 productArr
            Promise.all(productPromises)
                .then(res => {
                    this.productArr = productArr
                })
        }
    },
    created() {
        this.getProductData()
        this.getAddress()
    },
};
</script>

<style scoped lang='stylus'>
    .el-radio
        display block
        float none !important
        margin 0
        margin-bottom 10px
        padding-left 50px
    .el-select
        width 100%
    
    .pay
        position absolute
        top 110px;
        left 50%
        width 80%
        transform translateX(-50%)
        z-index -1
        .enter-order
            position absolute
            right 0
            width 350px
            border 1px solid red
            text-align right
            padding 25px 15px
            box-sizing border-box
            margin-bottom 20px
            & > :nth-child(1)
                margin-bottom 20px
                span 
                    color #ccc
                    font-size 23px
                    font-weight bold
                    em
                        color #f40
                        font-weight bold
            p
                font-size 12px
                color #000
            p, button
                margin-bottom 10px
            
        .choose-address
            & > :nth-child(1)
                width 100%
                border-bottom 2px solid #ddd
                padding-bottom 5px
                margin-bottom 30px
        .order-content
            & > :nth-child(1)
                width 100%
                border-bottom 2px solid #ddd
                padding-bottom 5px
                margin-bottom 10px
                margin-top 50px
        .total-price
            height 200px
            width 100%
            background-color #fff
            margin-top 10px
            .enter-address
                width 30%
                border 1px solid #ccc
        .order-list
            width 100%
            .order-item
                // height 130px
                margin-bottom 20px
                background-color #fff
                .item-info
                    width 100%
                    height 30px
                    background-color #333
                    color #fff
                    box-shadow 0 0 0 1px rgba(0,0,0,.3)
                    .order-time
                        font-size 12px
                        font-weight bold
                        line-height 30px
                        margin 0 30px
                    .order-id
                        line-height 30px
                        font-size 12px
                .item
                    padding 10px
                    box-sizing border-box
                    .item-content
                        width 100%
                        height 100px
                        display flex
                        flex-flow nowrap row
                        justify-content space-around
                        align-items center
                        .order-detail
                            cursor pointer
                            font-size 12px
                            &:hover 
                                color orange
                        .price
                            color #f40
                            font-size 17px
                        .item-count
                            width 80px
                            font-size 12px
                            color #999
                            & > :nth-child(1)
                                color #333
                                font-size 14px
                                margin-bottom 5px
                        .order-img
                            flex none
                            width 70px
                            height 70px
                            box-shadow 0 0 2px 1px rgba(0,0,0,.3)
                            cursor pointer
                            // margin-left -20px
                            img 
                                width 100%
                                height 100%
                        .order-title
                            width 300px
                            max-height 38px
                            overflow hidden
                            cursor pointer
                            &:hover
                                color orange
</style>