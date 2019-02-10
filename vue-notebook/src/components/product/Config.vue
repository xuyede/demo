<template>
    <div class="config" v-if="Object.keys(productDetail).length > 0">
        <table>
            <thead>
                <tr>
                    <td colspan="2">基本参数</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>商品名称</td>
                    <td>{{ productDetail.name }}</td>
                </tr>
                <tr>
                    <td>品牌</td>
                    <td>{{ productDetail.brand }}</td>
                </tr>
                <tr>
                    <td>操作系统</td>
                    <td>{{ productDetail.os }}</td>
                </tr>
                <tr>
                    <td>商品定位</td>
                    <td>{{ productDetail.position }}</td>
                </tr>
                <tr>
                    <td>CPU</td>
                    <td>{{ productDetail.cpu }}</td>
                </tr>
                <tr>
                    <td>GPU</td>
                    <td>{{ productDetail.gpu }}</td>
                </tr>
                <tr>
                    <td>RAM</td>
                    <td>{{ productDetail.ram }}</td>
                </tr>
                <tr>
                    <td>ROM</td>
                    <td>{{ productDetail.rom }}</td>
                </tr>
                <tr>
                    <td>屏幕尺寸</td>
                    <td>{{ productDetail.screen_type }}</td>
                </tr>
                <tr>
                    <td>机身厚度</td>
                    <td>{{ productDetail.thickness }}</td>
                </tr>
                <tr>
                    <td>颜色</td>
                    <td>{{ productDetail.color }}</td>
                </tr>
                <tr>
                    <td>机身重量</td>
                    <td>{{ productDetail.weight }}</td>
                </tr>

            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data () {
        return {
            productDetail : {}
        }
    },
    methods: {
        getProductDetail (productNum) {
            this.$axios.get('/api/commodity/get_detail?commodity_id=' + productNum)
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.productDetail = res.data.Data[0]
                    }
                })
        },
    },
    created() {
        const productNum = this.$route.params.id
        this.getProductDetail(productNum)
    },
};
</script>

<style scoped lang='stylus'>
    .config
        table
            width 100%
            margin-top 10px
            thead
                background-color #ddd
                color #333
                width 100%
                td
                    height 38px
                    padding-left 10px

               
            tbody
                border 1px solid #ddd
                box-sizing border-box
                & > :nth-child(even)
                    background-color #eee
                tr
                    & > :nth-child(1)
                        border-right 1px solid #ddd
                        border-bottom 1px solid #ddd
                        height 28px
                        width 172px
                        text-align right
                        padding-right 20px
                    & > :nth-child(2)
                        border-bottom 1px solid #ddd
                        height 28px
                        width 616px
                        text-align left
                        padding-left 20px
        

</style>