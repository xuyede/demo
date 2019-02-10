<template>
    <div>
        支付成功, 请稍等
    </div>
</template>

<script>
export default {
    methods : {
        getDataCheck () {

            this.$axios
                .post('/api/order/user/add', this.$store.state.orderMeg)
                .then(res => {
                    this.$message({
                        showClose: true,
                        message: '购买成功',
                        type: 'success',
                        duration: 1500
                    });
                    this.$router.push({name : 'HomeLink'})
                })


            // let number = 0
            // let data = null
            // // 同步提交多个请求
            // const promises = this.$store.state.payList.map( item => {
            //     // 兼容直接购买还是购物车结算
            //     if (this.$route.params.flag === 'product') {
            //         data = {
            //             "shopcart_id" : null,
            //             "address_id" : this.$store.state.payAddress[this.$store.state.radio].address_id,
            //             "commodity_id": item.commodity_id,
            //             "count": 1,
            //         }
            //         // this.$store.commit('changeOrderMeg', data)
            //     } else {
            //         data = {
            //             "shopcart_id" : item.shopId,
            //             "address_id" : this.$store.state.payAddress[this.$store.state.radio].address_id
            //         }
            //         // this.$store.commit('changeOrderMeg', data)
            //     }
                
            //     // 添加订单
            //     return this.$axios
            //         .post('/api/order/user/add', data)
            //         .then(res => {
            //             console.log(res)
            //             if (res.data.Code === this.$store.state.isSuccessResp) {
            //                 number ++
            //             }
            //         })
            // })
            // // 异步处理
            // Promise.all(promises)
            //     .then(res => {
            //         if (number == this.$store.state.payList.length) {
            //             this.$axios
            //                 .post('/api/order/user/add', data)
            //                 .then(res => {
            //                     this.$message({
            //                         showClose: true,
            //                         message: '购买成功',
            //                         type: 'success',
            //                         duration: 1500
            //                     });
            //                     this.$router.push({name : 'HomeLink'})
            //                 })
            //         }
            //     })
        }
    },
    created() {
        this.getDataCheck()
    },
};
</script>

<style scoped lang='stylus'>
    div
        height 400px
        width 100%
        line-height 400px
        text-align center
        font-size 20px
        color #000
</style>