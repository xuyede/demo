<template>
    <div class="wait-delivery">
        <ul class="order-list" v-if="waitDeliveryList.length > 0">
            <li 
                class="order-item"
                v-for="(item, index) in waitDeliveryList"
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
                    </div>
                </div>
            </li>
        </ul>
        <p v-else class='none-waitDelivery'>
            没有相关订单
        </p>
    </div>
</template>

<script>
export default {
    data () {
        return {
            waitDeliveryList : []
        }
    },
    created() {
        this.waitDeliveryList = this.$store.state.waitDeliveryList
    },
};
</script>

<style scoped lang='stylus'>
.none-waitDelivery
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