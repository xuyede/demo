<template>
    <div class="order-detail">
        <el-steps :space="200" :active="orderDetail.status + 1" finish-status="success" :align-center="true">
            <el-step title="商品付款"></el-step>
            <el-step title="卖家发货"></el-step>
            <el-step title="确认收货"></el-step>
            <el-step title="评价"></el-step>
        </el-steps>
        <div class="detail-content" v-if="Object.keys(orderDetail).length > 0">
            <div class="detail">
                <div class="address-box">
                    <p>订单信息</p>
                    <div class="address">
                        <p>订单编号: {{ orderDetail.order_id }}</p>
                        <p>客户姓名: {{ orderDetail.recv_address.recv_name}}</p>
                        <p>联系电话: {{ orderDetail.recv_address.recv_telphone}}</p>
                        <p>收货地址: {{ orderDetail.recv_address.address }}</p>
                    </div>
                </div>
                <div class="product">
                    <div class="item">
                        <div class="item-content">
                            <router-link 
                                class="order-img"
                                tag="div"
                                :to="{name : 'ProductLink', params : {id : orderDetail.commodity.commodity_id}}"
                            >
                                <img :src="orderDetail.commodity.images[0]" alt="">
                            </router-link>
                            <router-link
                                class="order-title"
                                tag="div"
                                :to="{name : 'ProductLink', params : {id : orderDetail.commodity.commodity_id}}"
                            >
                                {{ orderDetail.commodity.name }}
                            </router-link>
                            <div class="item-count">
                                <p>¥{{ orderDetail.unit_price }}</p>
                                <p>数量:{{ orderDetail.count }}</p>
                            </div>
                            <el-button 
                                size="mini" 
                                type="warning" 
                                v-if="orderDetail.status === 2"
                                @click.native="handleShowComment"
                                :disabled="disabled"
                            >
                                评价
                            </el-button>
                            <el-button 
                                size="mini" 
                                type="warning" 
                                v-else-if="orderDetail.status === 1" 
                                @click.native="handleEnter(orderDetail.order_id)"
                            >
                                确认收货
                            </el-button>
                        </div>
                        <div class="comment-content" :class="{display : isDisplay}">
                            <el-input
                                placeholder="请输入对商品的评价"
                                v-model="value"
                                clearable>
                            </el-input>
                            <el-button type="warning" size="mini" @click.native="handleAddComment(orderDetail.commodity.commodity_id)">添加评价</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-price">
                <p>商品总价: <em>¥{{ orderDetail.unit_price * orderDetail.count }}</em></p>
                <p>实付款: <em>¥{{ orderDetail.unit_price * orderDetail.count }}</em></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            orderDetail : {},
            value : '',
            isDisplay : false,
            disabled : false
        }
    },
    methods: {
        // 添加评价
        handleAddComment (productId) {
            const data = {
                "commodity_id": productId,
                "content": this.value,
                "order_id" : this.orderDetail.order_id
            }
            this.$axios 
                .post('/api/comment/add', data)
                .then(res => {
                    if (res.data.Code == this.$store.state.isSuccessResp) {
                        this.$message({
                            showClose: true,
                            message: '评价完成',
                            type: 'success',
                            duration: 1500
                        })
                        this.isDisplay = false
                        this.orderDetail.status++
                    }
                })
        },
        handleShowComment (productId) {
            this.isDisplay = !this.isDisplay
        },
        // 确认收货
        handleEnter (orderId) {
            const data = {
                "order_id" : orderId
            }
            this.$axios
                .post('/api/order/user/comfirm', data)
                .then(res => {
                    if (res.data.Code == this.$store.state.isSuccessResp) {
                        this.$message({
                            showClose: true,
                            message: '确认收货成功',
                            type: 'success',
                            duration: 1500
                        })
                        this.getOrderDetailData()
                    }
                })
        },
        // 获取订单数据
        getOrderDetailData () {
            const orderId = this.$route.params.id
            this.$axios
                .get('/api/order/user/get?order_id=' + orderId)
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.orderDetail = res.data.Data[0]
                    }
                })
        }
    },
    created() {
        this.getOrderDetailData()
    },
};
</script>

<style scoped lang='stylus'>
    .el-steps--horizontal
        justify-content center !important
        margin-bottom 50px
    .order-detail
        position absolute
        top 110px;
        left 50%
        width 80%
        transform translateX(-50%)
        z-index -1
        .detail-content
            display flex
            flex-flow column nowrap 
            justify-content center
            align-items flex-start
            .detail
                display flex
                flex-flow row nowrap 
                justify-content flex-start
                align-items flex-start
                width 100%
                padding 0 50px
                box-sizing border-box
                .address-box
                    flex none
                    flex-basis 300px
                    height 200px
                    & > P
                        height 30px
                        line-height 30px
                        background-color #eee
                        color #000
                        padding-left 20px
                        font-size 13px
                        font-weight bold 
                        border 1px solid #ccc
                        box-sizing border-box
                        border-bottom-color transparent
                    .address
                        height 100%
                        padding 10px 20px
                        box-sizing border-box
                        border 1px solid #ccc
                        p   
                            margin-bottom 10px
                            font-size 13px
                .product
                    height 230px
                    flex auto
                    .item
                        position relative
                        height 100%
                        padding 10px
                        box-sizing border-box
                        width 100%
                        background-color #fff
                        .comment-content
                            position absolute
                            bottom 20px
                            left 20px
                            width 100%

                            display none
                            .el-input
                                width 80%
                            &.display
                                display block
                        .item-content
                            width 100%
                            height 100%
                            display flex
                            flex-flow nowrap row
                            justify-content space-around
                            align-items center
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
            .product-price
                width 91.2%
                height 150px
                padding 0 50px
                box-sizing border-box
                margin auto
                background-color #ddd
                margin-top 10px
                text-align right
                & > :nth-child(1)
                    color #000
                    font-size 13px
                    margin-top 30px
                    em
                        display inline-block
                        width 100px
                        margin-left 10px
                & > :nth-child(2)
                    color #000
                    font-size 18px
                    margin-top 30px
                    em
                        display inline-block
                        width 100px
                        margin-left 10px
                        color #f40
                
</style>