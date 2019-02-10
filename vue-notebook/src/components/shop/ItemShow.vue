<template>
    <div class="show-list">
        <el-tag 
            size="small" 
            v-for="tag in tags" 
            :key="tag.name" 
            closable 
            :type="tag.type" 
            @close="handleClose(tag)"
            v-if="tags.length > 0"
        >
            {{tag.name}}
        </el-tag>
        <div class="list-content">
            <ul class="list" v-if="showList.length > 0">
                <li  
                    v-if="showList.length > 0"
                    v-for="(item, index) in showList"
                    :key="index"
                    class="item"
                >
                    <router-link :to="{ name : 'ProductLink', params : { id : item.commodity_id} }" class="item-img">
                        <img :src="item.images[0]" alt="">
                    </router-link>
                    <div class="item-meg">
                        <p class="item-price">¥ {{ item.price }}</p>
                        <p class="item-title">{{ item.name }}</p>
                    </div>
                    <div class="item-addCart" @click="handleAddCart(item)">
                        <span class="iconfont">&#xe600;</span>
                    </div>
                </li>
            </ul>
            <p v-else class="notFind">
                没找到相关商品
            </p>
            <div class="block">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="20"
                    layout="prev, pager, next, jumper"
                    :total="totalProductCount"
                    v-loading.fullscreen.lock="fullscreenLoading"
                >
                </el-pagination>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    props : {
        choose : {
            type : Object,
        }
    },
    data() {
        return {
            currentPage: 1,  // 当前页
            fullscreenLoading: false,  // 全屏加载
            totalProductCount : 210,  // 商品总数
            showList : [  // 渲染假数据
                {
                    price : 8888,
                    name : 'xuyede',
                    images : ['@/assets/img/fake.jpg'],
                    commodity_id : 12306
                },
                {
                    price : 8888,
                    name : 'xuyede',
                    images : ['@/assets/img/fake.jpg'],
                    commodity_id : 12307
                },
                {
                    price : 8888,
                    name : 'xuyede',
                    images : ['@/assets/img/fake.jpg'],
                    commodity_id : 12308
                },
                {
                    price : 8888,
                    name : 'xuyede',
                    images : ['@/assets/img/fake.jpg'],
                    commodity_id : 12309
                }
            ],
            tags: [  // 筛选条件列表
                // { name: "8G", type: "info" },
            ]
        };
        
    },
    watch: {
        // 监听筛选条件
        choose () {
            // 同一个选择不能多点
            for (let i = 0; i < this.tags.length; i++) {
                if (this.tags[i].tag === this.choose.tag) {
                    return
                }
            }

            this.tags.push({ 
                name : this.choose.name, 
                type : 'info', tag : this.choose.tag, 
                key: this.choose.key,
                start: this.choose.start,
                end: this.choose.end
            })

            this.getChoosePage(0)
        },
        showList () {
            this.fullscreenLoading = false
        }
    },
    methods : {
        // 处理删除筛选列表
        handleClose (tag) {
            const target = tag.name
            const tags = this.tags
            for (let i = 0; i < this.tags.length; i++) {
                if (tags[i].name == target) {
                    tags.splice(tags.indexOf(tags[i]), 1)
                    break
                }
            }
            // 删除tag时请求
            this.getChoosePage(0)
        },
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`);
        },
        // 切换页
        handleCurrentChange (val) {
            console.log(`当前页: ${val}`);
            // 是否为筛选展示
            this.tags.length === 0
            ? this.getPageData(val - 1)
            : this.getChoosePage(val - 1)
        },
        // 获取数据
        getPageData (page) {
            this.fullscreenLoading = true
            this.$axios
                .get('/api/commodity/get_detail/?page=' + page)
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp && res.data.Data) {
                        const productData = res.data.Data.slice(1)
                        this.dealPageData(productData)
                    }
                })
        },
        // 处理非筛选展示数据
        dealPageData (data) {
            this.showList = data.concat([])
        },
        // 处理筛选请求 params
        getUrlParam (page) {
            const tags = this.tags

            let urlParams = tags
                .reduce( (baton, curVal) => {
                    curVal.key 
                    ? baton += (`${curVal.key}=${curVal.name}&`)
                    : baton += (`start=${curVal.start}&end=${curVal.end}&`)

                    return baton
                }, '')
                .replace(/(\&)$/g, '');
                
            urlParams = urlParams + `&page=${page}`
            return urlParams
        },
        // 获取筛选数据
        getChoosePage (page) {
            /* /api/commodity/get_detail?brand=联想&os=windows10&ram=8G&start=4000&end=5000&page=0 */
            const url = this.getUrlParam(page)  
            this.fullscreenLoading = true     
            this.$axios
                .get(`/api/commodity/get_detail?${url}`)
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp && res.data.Data) {
                        const totalNum = (res.data.Data).concat([]).shift()
                        const productData = (res.data.Data).concat([]).slice(1)
                        this.dealChooseData(productData)
                        this.totalProductCount = totalNum.total_count
                    }
                })
        },
        // 处理筛选展示数据
        dealChooseData (data) {
            this.showList = data.concat([])
        },
        // 添加购物车
        handleAddCart (productDetail) {
            // window.sessionStorage.getItem('isLogin')
            if (!this.$store.state.isLogin) {
                this.$store.state.displayLogin = true
                this.$message({
                    showClose: true,
                    message: '请先登录账号',
                    type: 'warning',
                    duration: 1500
                });
                return
            }
            this.$axios
                .post('/api/shopcart/add', { commodity_id : productDetail.commodity_id, count : 1 })
                .then(res => {
                    if (res.data.Code == this.$store.state.isSuccessResp) {
                        this.$message({
                            showClose: true,
                            message: '已添加到购物车',
                            type: 'success',
                            duration: 1500
                        });
                    }
                })
        }
    },
    created() {
        this.getPageData(0)
    },
};
</script>

<style scoped lang='stylus'>
    .show-list >>> .el-pagination
        // padding-left 200px
        position absolute
        left 50%
        top 50%
        transform translate(-50%, -50%)
        
    .show-list >>> .el-tag
        margin-right 10px
        margin-bottom 20px
    .show-list
        padding 10px
        .list-content
            background-color #fff
            margin-bottom 50px
            padding-bottom 20px
            .block
                position relative
                width 100%
                height 50px
            .notFind
                width 100%
                height 100px
                line-height 100px
                text-align center
                color #999
                font-size 20px
                font-weight bold
            .list
                // text-align justify
                width 100%
                font-size 0
                padding 10px
                box-sizing border-box
                
                // &::after
                //     content ''
                //     display inline-block
                //     width 100%
                .item
                    display inline-block
                    width 20%
                    font-size 14px
                    padding 5px
                    cursor pointer
                    margin 0 10px 10px 20px
                    
                    &:hover
                        box-shadow 0 0 2px 1px rgba(0,0,0,.3)
                    .item-img
                        width 100%
                        height 175px
                        img
                            width 100%
                            height 100%
                    .item-meg
                        *
                            margin-top 5px
                            padding 5px
                            box-sizing border-box
                            font-size 12px
                        .item-price
                            font-size 16px
                            color red
                        .item-title
                            height 35px
                            overflow hidden
                            color #333
                            font-size 13px
                            margin-bottom 20px
                            padding 0 10px
                            box-sizing border-box
                    .item-addCart
                        width 100%
                        height 40px
                        border-top 1px solid #ddd
                        text-align center
                        line-height 40px


</style>
