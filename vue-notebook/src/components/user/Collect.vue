<template>
    <div class="collect">
        <p class="title">收藏列表</p>
        <div class="item" v-if="collectionList.length > 0">
            <div 
                class="collect-item"
                v-for="(item, index) in collectionList"
                :key="index"
            >
                <router-link
                    tag="div"
                    class="item-img"
                    :to="{ name : 'ProductLink', params : { id : item.commodity.commodity_id} }"
                >
                    {{ item.commodity_id }}
                    <img :src="item.commodity.images[0]" alt="">
                </router-link>
                <p class="item-title">{{ item.commodity.name }}</p>
                <p class="item-price">¥ {{ item.commodity.price }}</p>
                <span class="delete-collect iconfont" @click="handleDelateCollect(item.collection_id, index)">&#xe66e;</span>
            </div>
        </div>
        <p v-else class="collectList-empty">
            收藏列表为空
        </p>
    </div>
</template>
/* collectionList 数据不对, 传到 */
<script>
import { mapState } from 'vuex'

export default {
    data () {
        return {
        }
    },
    computed: {
        ...mapState({
            collectionList : 'collectList'
        })
    },
    methods : {
        // 获取收藏列表的数据
        getCollectData () {
            this.$axios
                .get('/api/collection/get')
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        const collectionList = res.data.Data
                        this.$store.state.collectList = collectionList
                    }
                })
        },
        // 处理删除收藏操作
        handleDelateCollect (collectionId, index) {
            const data = {
                'collection_id' : collectionId
            }
            this.$axios
                .post('/api/collection/delete', data)
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        // 处理显示的数据
                        this.$store.dispatch('asyncRemoveCollect', index)
                        this.$message({
                            showClose: true,
                            message: '商品已移除出收藏',
                            type: 'success',
                            duration: 1500
                        });
                    }
                })
        }
    },
    created() {
        this.getCollectData()
    },
};
</script>

<style scoped lang='stylus'>
.collect
    padding 15px

    .collectList-empty
        width 100%
        height 100px
        text-align center
        line-height 100px
        font-size 18px
        font-weight bold
    .title
        border-bottom 1px solid #ccc
        height 30px
        padding 5px
        box-sizing border-box
        margin-bottom 10px
        font-weight bold

    .item
        display flex
        justify-content flex-start
        align-items center
        flex-flow wrap row
        .collect-item
            overflow hidden
            position relative
            flex none
            width 100px
            height 150px
            padding 5px
            margin-left 29px
            border 1px solid #ccc
            margin-bottom 25px
            background-color #eee
            cursor default 
            .delete-collect
                display none
                position absolute
                top -20px
                right -20px
                height 40px
                width 40px
                line-height 58px
                padding-left 4px
                background-color #999
                color #fff
                border-radius 100%
                cursor pointer
                box-sizing border-box
                &:hover
                    color orange
            &:hover .delete-collect
                display block
                border none

            &:hover
                box-shadow 0 0 5px 2px rgba(0,0,0,.3)
            .item-title
                border-top 1px solid #ddd
                padding-top 5px
            .item-img
                width 100px
                height 100px
                cursor pointer
                img 
                    width 100%
                    height 100%
            p
                font-size 12px
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
                text-align center
                margin 5px

</style>