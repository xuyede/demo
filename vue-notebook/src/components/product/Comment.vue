<template>
    <div class="comment">
        <ul class='comment-list' v-if="hasComment">
            <li 
                class="comment-item"
                v-for="(item, index) in commentList"
                :key="index"
            >
                <p class="user-name">{{ item.username }}</p>
                <p>{{ item.time }}</p>
                <p>{{ item.content }}</p>
            </li>
        </ul>
        <span v-else class="no-comment">暂时没有评论</span>
    </div>
</template>

<script>


export default {
    data () {
        return {
            commentList : [],
            hasComment : true
        }
    },
    watch: {
        commentList () {
            this.commentList.length > 0 
            ? this.hasComment = true
            : this.hasComment = false
        }
    },
    methods: {
        getCommentData (num) {
            this.$axios.get('/api/comment/user/get?commodity_id=' + num)
                .then(res => {
                    if (res.data.Code === 0) {
                        const comments = res.data.Data.slice(1)
                        comments.forEach( comment => {
                            comment.time = this.$moment(new Date(comment.create_time)).format('YYYY-MM-DD HH:mm:ss')
                        }) 
                        this.commentList = comments
                    }
                })
        }
    },
    created() {
        const num = this.$route.params.id
        this.getCommentData(num)
    },
};
</script>

<style scoped lang='stylus'>
    .comment
        width 90%
        margin 0 auto
        .no-comment
            display inline-block
            width 100%
            height 100px
            text-align center
            line-height 100px
            font-size 20px
            font-weight bold
            color #999
        .comment-list
            width 100%
            padding 10px 20px 
            .comment-item
                width 100%
                & > :nth-child(1)
                    font-size 16px
                    font-weight bold
                    margin-bottom 5px
                & > :nth-child(2)
                    font-size 11px
                    margin-bottom 5px
                    color #ccc
                & > :nth-child(3)
                    font-size 16px
                    margin-bottom 10px
                    color #999
                border-bottom 1px solid #ddd
                margin-bottom 15px
</style>