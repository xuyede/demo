<template>
    <div class="all-order">
        <ul class="order-list" v-if="orderList.length > 0">
            <li 
                class="order-item"
                v-for="(item, index) in orderList"
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
                        <div class="order-state">状态 : {{ item.state }}</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {
            orderList : []
        }
    },
    computed: {
        isDone () {
            return 
        }
    },
    methods: {
        dealOrderData (data) {
            // 分解订单数据 -> 待发货/待收货
            let copyData1 = data.concat([]),
                waitDeliveryList = [],
                waitEnterList = []

            copyData1.forEach( item => {
                if (item.status == 0) {
                    // this.$store.dispatch('asyncAddWaitDelivery', item)
                    waitDeliveryList.push(item)
                } else if(item.status == 1){
                    // this.$store.dispatch('asyncAddWaitEnter', item)
                    waitEnterList.push(item)
                }
            })
            this.$store.dispatch('asyncAddWaitDelivery', waitDeliveryList)
            this.$store.dispatch('asyncAddWaitEnter', waitEnterList)

            // 添加状态, 订单时间
            let copyData = data.concat([])
            const result = copyData.map( item => {
                let state = null
                if (item.status == 0) {
                    state = '待发货'
                } else if (item.status == 1) {
                    state = '待收货'
                } else if (item.status == 2) {
                    state = '未评价'
                } else if (item.status == 3) {
                    state = '已评价'
                }

                item.state = state
                item.time = this.$moment(new Date(item.create_time)).format('YYYY-MM-DD HH:mm:ss')
                return item
            })
            
            return result
        },
        getOrderData () {

            this.$axios
                .get('/api/order/user/get')
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        // status 0->等待后台确认  1->等待用户确认   2->订单完成
                        const arr = res.data.Data
                        const result = this.dealOrderData(arr.concat([]))
                        this.orderList = result
                    }
                })      
        }
    },
    created() {
        this.getOrderData()
    },
};
</script>

<style scoped lang='stylus'>
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