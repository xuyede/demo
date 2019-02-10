<template>
    <div class="order">
        <p>订单信息</p>
        <ul>
            <router-link tag="li" :to="{name : 'AllOrderLink'}">全部订单</router-link>
            <router-link tag="li" :to="{name : 'WaitDeliveryLink'}">待发货</router-link>
            <router-link tag="li" :to="{name : 'WaitEnterLink'}">待收货</router-link>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>
export default {

};
</script>

<style scoped lang='stylus'>
.router-link-active
    color orange !important
.order
    padding 15px
    ul
        overflow hidden
        width 100%
        height 40px
        margin-bottom 10px
        li
            float left
            width 33.3%
            height 100%
            text-align center
            line-height 40px
            background-color #333
            color #f0f0f0
            font-weight bold
            cursor pointer
            &:hover
                color orange
    p
        border-bottom 1px solid #ccc
        height 30px
        padding 5px
        box-sizing border-box
        margin-bottom 10px
        font-weight bold

                    
</style>