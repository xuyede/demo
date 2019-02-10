<template>
    <div class="user-comment">
        <p class="title">商品评论({{totalComment }})</p>
        <ul class="comment-list" v-if="commentList.length > 0">
            <li 
                class="order-item"
                v-for="(item, index) in commentList"
                :key="index"
            >
                <div class="item-info">
                    <em class="order-time">{{ item.time }}</em>
                </div>
                <div class="item">
                    <div class="item-content">
                        <router-link 
                            class="order-img"
                            tag="div"
                            :to="{name : 'ProductLink', params : {id : item.commodity_id}}"
                        >
                            <img :src="item.url" alt="">
                        </router-link>
                        <p>{{ item.content }}</p>
                        <p>用户 : {{ item.username }}</p>
                        <el-button type="warning" size="mini" @click.native="handleDeleteComment(index)">删除</el-button>
                    </div>
                </div>
            </li>   
        </ul> 
        <p v-else class="none-comment">
            没有商品评价
        </p>
    </div>
</template>

<script>
export default {
    data () {
        return {
            commentList : [],
            totalComment : 0
        }
    },
    methods : {
        //  删除评价
        handleDeleteComment (index) {
            const data = {
                "comment_id" : this.commentList[index].comment_id
            }
            this.commentList.splice(index, 1)
            this.totalComment--
            // 数据库删除评价
            this.$axios
                .post('/api/comment/user/delete', data)
                .then( res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.$message({
                            showClose: true,
                            message: '评价删除成功',
                            type: 'success',
                            duration: 1500
                        })
                    }
                })
        },
        getImg () {
            let resultArr = []  // 渲染数据数组
            const promises = this.commentList.map(item => {
                return this.$axios
                    .get('/api/commodity/get?commodity_id=' + item.commodity_id)
                    .then(res => {
                        if (res.data.Code === this.$store.state.isSuccessResp) {
                            // 添加图片 url/ 时间
                            item.url = res.data.Data[0].images[0]
                            item.time = this.$moment(new Date(item.create_time)).format('YYYY-MM-DD HH:mm:ss')
                            resultArr.push(item)
                        }
                    })
            })
            // 同步等待处理
            Promise.all(promises)
                .then(res => this.commentList = resultArr)
        },
        getCommentData () {
            this.$axios
                .get('/api/comment/user/get')
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        const data = res.data.Data
                        this.commentList = data.concat([]).slice(1)
                        this.totalComment = data.shift().total_count
                        this.getImg()
                    }
                })
        }
    },
    created() {
        this.getCommentData()
    },
};
</script>

<style scoped lang='stylus'>
.user-comment
    padding 15px
    .none-comment
        height 100px
        line-height 100px
        width 100%
        font-size 20px
        font-weight bold
        color #ddd
        text-align center
    .title
        border-bottom 1px solid #ccc
        height 30px
        padding 5px
        box-sizing border-box
        margin-bottom 10px
        font-weight bold
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