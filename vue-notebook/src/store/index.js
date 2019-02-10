import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state : {
        displayLogin : false,
        displayCart : false,
        username : 'test',
        isLogin : false,
        isSuccessResp : 0,
        cartList : [],
        collectList : [],
        addressList : [],
        waitDeliveryList : [],
        waitEnterList : [],
        orderMeg : {},
        payList : [],
        payAddress : [],
        radio : 0,
        allProduct : []
    },
    mutations : {
        addAllProduct (state, param) {
            state.allProduct.push(param)
        },
        changeOrderMeg (state, param) {
            state.orderMeg = param
        },
        changeRadio (state, param) {
            state.radio = param
        },
        changePayAddress (state, param) {
            state.payAddress = param
        },
        changePayList (state, param) {
            state.payList = param
        },
        changeIsLogin (state, param) {
            state.isLogin = param
        },
        changeUsername (state, param) {
            state.username = param
        },
        showLogin (state, param) {
            state.displayLogin = param
        },
        showCart (state, param) {
            state.displayCart = param
        },
        removeProduct (state, index) {
            state.cartList.splice(index, 1)
        },
        removeCollect (state, index) {
            state.collectList.splice(index, 1)
        },
        fillCollectList (state, param) {
            state.collectList = param
        },
        removeAddress (state, index) {
            state.addressList.splice(index, 1)
        },
        addWaitDelivery (state, item) {
            state.waitDeliveryList = item
        },
        addWaitEnter (state, item) {
            state.waitEnterList = item
        }
    },
    actions : {
        // 删除购物车
        asyncRemoveProduct (ctx, index) {
            ctx.commit('removeProduct', index)
        },
        // 删除收藏
        asyncRemoveCollect (ctx, index) {
            ctx.commit('removeCollect', index)
        },
        // 删除地址
        asyncRemoveAddress (ctx, index) {
            ctx.commit('removeAddress', index)
        },
        // 添加 waitDelivery
        asyncAddWaitDelivery (ctx, item) {
            ctx.commit('addWaitDelivery', item)
        },
        // 添加 waitEnter
        asyncAddWaitEnter (ctx, item) {
            ctx.commit('addWaitEnter', item)
        },
        // 添加全部商品
        asyncAddAllProduct (ctx, item) {
            ctx.commit('addAllProduct', item)
        }
    }
})