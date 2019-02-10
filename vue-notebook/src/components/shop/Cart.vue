<template>
    <div class="shopcart">
        <div class="cart-title">购物车</div>
        <ul class="cart-item"  v-if="cartList.length > 0">
            <li
                v-for="(item, index) in cartList"
                :key="index"                    
            >
                <input class="check-box" type="checkbox" :id="item.commodity.commodity_id" :value="item.commodity.commodity_id" v-model="checkBoxArr">
                <label :for="item.commodity.commodity_id"></label>
                <div class="cart-item-img">
                    <img :src="item.commodity.images[0]" alt="">
                </div>
                <div class="cart-itrm-content">
                    <div class="cart-item-desc">
                        <router-link 
                            tag="h3" 
                            :to="{ name : 'ProductLink', params : { id : item.commodity.commodity_id} }" 
                        >
                            {{ item.commodity.name }}
                        </router-link>
                        <p>操作系统 : {{ item.commodity.os }}</p> 
                        <p>屏幕尺寸 : {{ item.commodity.screen_type }}</p>
                        <p>价格 : ¥{{ item.commodity.price }}</p>
                    </div>
                </div>
                <span>数量: {{ item.count }} </span>
                <button class="delete-item" @click="handleDeleteCart(index)">移除</button>
            </li>
        </ul>
        <p v-else class="cart-emtpy">
            购物车为空
        </p>
        <p class="cart-total-price">合计 : <em>¥{{ totlePrice }}</em></p>
        <p 
            class="cart-into-cart" 
            @click="handleCart2Pay"
        >
            结算
        </p>
        <!-- <router-link 
            class="cart-into-cart" 
            tag="p" 
            :to="{name : 'PayLink', params : {sum : totlePrice, chooseProduct : chooseProduct}}"
            @click.native="handleCart2Pay"
        >
            结算
        </router-link> -->
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data () {
        return {
            checkBoxArr : [],
            totlePriceArr : [],
            chooseProduct : [],
        }
    },
    watch: {
        // 监听购物车的选择列表
        checkBoxArr () {
            if (this.checkBoxArr.length > 0) {
                // 每次改变时清空价格列表 / 商品列表
                this.totlePriceArr = []
                this.chooseProduct = []
                // 把选择的商品价格放进价格列表中
                this.checkBoxArr.forEach( commodity_id => {
                    this.cartList.forEach( item => {
                        const product = item.commodity
                        const productCount = item.count
                        const shopCartId = item.shopcart_id
                    
                        if (product.commodity_id === commodity_id) {
                            this.totlePriceArr.push(product.price * productCount)
                            
                            // 商品列表 (count id)
                            const data = {
                                count : productCount,
                                id : commodity_id,
                                shopCartId : shopCartId
                            }
                            this.chooseProduct.push(data)
                        }
                    })
                })
            } else {
                this.totlePriceArr = []
            }
        }
    },
    computed: {
        ...mapState({
            cartList : 'cartList'
        }),
        // 根据价格列表请求总价格
        totlePrice () {
            if (this.totlePriceArr.length > 0) {
                return this.totlePriceArr.reduce( (baton, curVal) => baton + curVal )
            } else {
                return 0
            }
        }
    },
    methods : {
        // 跳转支付界面
        handleCart2Pay () {
            if (this.chooseProduct.length === 0) {
                this.$message({
                    showClose: true,
                    message: '购物车为空',
                    type: 'error',
                    duration: 1500
                });
                return
            }
            // 路由跳转
            this.$router.push({name : 'PayLink', params : {sum : this.totlePrice, chooseProduct : this.chooseProduct}})
            // 初始化购物车
            this.$store.commit('showCart', !this.$store.state.displayCart)
            this.checkBoxArr = []
            this.chooseProduct = []
        },
        // 处理购物车移除
        handleDeleteCart (index) {
            const shopCartId = this.$store.state.cartList[index].shopcart_id
            // 真实移除数据
            this.$axios.post('/api/shopcart/delete', { 'shopcart_id' : shopCartId })
                .then(res => {
                    if (res.data.Code == this.$store.state.isSuccessResp) {
                        // 修改显示的数据, vuex中
                        this.$store.dispatch('asyncRemoveProduct', index)
                        this.$message({
                            showClose: true,
                            message: '商品已移除出购物车',
                            type: 'success',
                            duration: 1500
                        });
                    }
                })
        }
    }
};
</script>

<style scoped lang='stylus'>
.shopcart
    position absolute
    width 550px
    height 600px
    top 85px
    right 0
    box-shadow 0 0 0 1px rgba(0,0,0,.2)
    z-index 1
    background-color #fff
    opacity 0
    transition all .3s
    transform scaleX(0)
    transform-origin 100% 0
    overflow hidden
    cursor default
    z-index 11
    &.active
        opacity 1
        transform scaleX(1)
    .cart-emtpy
        width 100%
        height 100px
        line-height 100px
        text-align center
        font-size 17px
        font-weight bold
        color #999
    .cart-title
        height 60px
        width 100%
        border-bottom 1px solid #cccccc
        color #999
        font-size 17px
        font-weight 600
        text-align center
        line-height 60px

    .cart-item
        height 405px
        width 100%
        padding 10px 0
        overflow auto
        li
            position relative
            width 90%
            margin-left 5%
            padding 15px 10px
            box-sizing border-box
            & > div
                display inline-block          
            span
                position absolute
                top 50%
                width 90px
                transform translateY(-50%)
                margin-left 30px
                font-size 13px
                z-index 1
            .delete-item
                position absolute
                top 50%
                right 10px
                width 40px
                height 20px
                transform translateY(-50%)
                font-size 10px
                color #fff
                line-height 20px 
                outline none 
                border none 
                border-radius 5px
                background-color #CC3333
                cursor pointer
                &:hover
                    background-color #CC3300

                
            .check-box
                display inline-block
                height 100px
                line-height 100px
                margin-right 10px
                outline none
                cursor pointer
            .cart-item-img
                width 100px 
                height 100px
                box-shadow 0 0 5px 1px rgba(0,0,0,.3)
                img 
                    width 100%
                    height 100%

            .cart-item-desc
                display table-cell
                height 100px
                vertical-align middle
                padding-left 20px
                p
                    font-size 12px
                    color #999
                h3
                    max-width 150px
                    color #333
                    font-weight 600
                    cursor pointer
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
                    &:hover
                        color orange
                *
                    margin 5px 0 0 5px
    .cart-total-price
        position absolute
        left 0
        bottom 60px
        width 100%
        height 40px
        font-size 16px
        text-align center
        border-top 1px solid #eee
        border-bottom 1px solid #eee
        padding 10px
        margin-top 15px
        box-sizing border-box
        z-index 99
        em
            color orange
    .cart-into-cart
        position absolute
        bottom 10px
        left 0
        width 80%
        height 40px
        line-height 40px
        color #fff
        font-weight bold
        font-size 16px
        text-align center
        margin 0 10%
        border-top 1px solid #eeeeee
        border-radius 5px
        background-color #333
        cursor pointer
        &:hover
            background-color #222

</style>