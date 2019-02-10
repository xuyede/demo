<template>
    <div class="shop">
        <div class="select-list">
            <p class="select-title">选择列表</p>
            <el-collapse v-model="activeName" accordion >
                <el-collapse-item title="品牌" name="1" >
                    <div v-for="(item, index) in grandList" :key="index" @click="handleClick">{{ item }}</div>
                </el-collapse-item>
                <el-collapse-item title="操作系统" name="2" >
                    <div v-for="(item, index) in OSList" :key="index" @click="handleClick">{{ item }}</div>
                </el-collapse-item>
                <el-collapse-item title="运行内存" name="3" >
                    <div v-for="(item, index) in CPUList" :key="index" @click="handleClick">{{ item }}</div>
                </el-collapse-item>
                <el-collapse-item title="价格" name="4" >
                    <div v-for="(item, index) in priceList" :key="index" @click="handleClick">{{ item }}</div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <show-list :choose="chooseValue"></show-list>
    </div>
</template>

<script>
// import ShowList from './ItemShow'
const ShowList = () => import('./ItemShow.vue')

export default {
    data() {
      return {
        activeName: '1',
        choose : {},  // 筛选条件
        grandList : ['小米', '联想', '苹果', '雷神', '三星', '戴尔', '惠普', '微星', '华硕', '华为', '神舟'],
        OSList : ['windows10', 'macOs'],
        CPUList : ['4GB', '8GB', '16GB'],
        priceList : ['1 - 4000', '4000 - 5000', '5000 - 6000', '6000 - 7000', '7000 以上'],
      };
    },
    computed: {
        chooseValue () {
            if ( Object.keys(this.choose).length > 1 ) {
                return this.choose
            }
        }
    },
    methods : {
        handleClick (e) {
            let key = undefined,
                start = undefined,
                end = undefined

            if (this.activeName == 1) {
                key = 'brand'
            } else if (this.activeName == 2) {
                key = 'os'
            } else if (this.activeName == 3) {
                key = 'ram'
            } else if (this.activeName == 4) {
                const startEndArr = e.target.innerText.split(' - ')
                if ( startEndArr.length > 1 ) {
                    [start, end] = startEndArr
                } else {
                    start = '7000'
                    end = '99999'
                }
            }
            this.choose = {
                name : e.target.innerText,
                tag : this.activeName,
                key,
                start,
                end
            }
        },
    },
    components : { ShowList }
};
</script>

<style scoped lang='stylus'>
    .select-list >>> .el-collapse-item__header
        padding-left 20px !important
    .select-list >>> .el-collapse-item__content
        padding 10px !important
        div
            text-align center
            margin-bottom 5px
            cursor pointer
            box-sizing border-box
            border-bottom 1px solid transparent
            font-size 14px
            &:hover
                border-bottom 1px solid orange
                color orange
    .shop
        position absolute
        top 110px
        left 50%
        width 80%
        display flex
        justify-content space-between
        align-items flex-start
        flex-flow nowrap row
        transform translateX(-50%)
        z-index -1
        .select-list
            flex 2
            .select-title
                height 40px
                line-height 20px
                padding 10px 
                border-bottom 1px solid #dddddd
                box-sizing border-box
                margin-bottom 10px 
                font-size 15px
                font-weight bold

        .show-list
            flex 9
            height 300px
            margin-left 30px
        
</style>