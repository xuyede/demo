<template>
    <div class="wait-delivery">
        <ul class="order-list" v-if="waitEnterList.length > 0">
            <li 
                class="order-item"
                v-for="(item, index) in waitEnterList"
                :key="index"
            >
                <div class="item-info">
                    <em class="order-time">{{ item.time }}</em>
                    <em class="order-id">订单号: {{ item.order_id }}</em>
                </div>
                <div class="item">
                    <div class="item-content">
                        <router-link 
                            class="order-img"
                            tag="div"
                            :to="{name : 'ProductLink', params : {id : item.commodity.commodity_id}}"
                        >
                            <img :src="item.commodity.images[0]" alt="">
                        </router-link>
                        <router-link
                            class="order-title"
                            tag="div"
                            :to="{name : 'ProductLink', params : {id : item.commodity.commodity_id}}"
                        >
                            {{ item.commodity.name }}
                        </router-link>
                        <div class="item-count">
                            <p>¥{{ item.unit_price }}</p>
                            <p>数量:{{ item.count }}</p>
                        </div>
                        <div class="price">¥{{ item.commodity.price * item.count }}</div>
                        <router-link 
                            class="order-detail"
                            tag="p"
                            :to="{ name : 'OrderDetailLink', params : {id : item.order_id, state : item.state}}"
                        >
                            详情
                        </router-link>
                        <el-button size="mini" type="warning" @click.native="handleEnter(item.order_id)">确认收货</el-button>
                    </div>
                </div>
                
            </li>
        </ul>
        <p v-else class='none-waitEnter'>
            没有相关订单
        </p>
    </div>
</template>

<script>
export default {
    data () {
        return {
            waitEnterList : []
        }
    },
    created() {
        this.waitEnterList = this.$store.state.waitEnterList
    },
    methods: {
        // 用户确认收货处理
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
                        this.$router.push({name : 'AllOrderLink'})
                    }
                })
        }
    },
};
</script>

<style scoped lang='stylus'>
.none-waitEnter
    height 50px
    width 100%
    text-align center
    line-height 50px
    font-size 20px
    font-weight bold
    color #ddd
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
                .order-state
                    width 110px
                    color orange
                    font-size 14px
                    font-weight bold
                    &.done
                        color #228B22
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