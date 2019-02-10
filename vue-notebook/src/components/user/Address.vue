<template>
    <div class="address">
        <p>地址管理</p>
        <el-table
            :data="$store.state.addressList"
            style="width: 100%"
            max-height="250"
            v-show="upDateAddress"
        >
            <el-table-column
                fixed
                prop="recv_name"
                label="姓名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址"
                width="320">
            </el-table-column>
            <el-table-column
                prop="recv_telphone"
                label="手机号码"
                width="120">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="155">
                <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="deleteRow(scope.$index, $store.state.addressList)"
                        type="text"
                        size="small"
                    >
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
       
        <!-- 添加地址 -->
        <p>地址添加</p>
        <el-form label-position="right" label-width="80px" :model="formLabelAlign">
            <el-form-item label="姓名">
                <el-input v-model="formLabelAlign.recv_name"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="formLabelAlign.address"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="formLabelAlign.recv_telphone"></el-input>
            </el-form-item>
        </el-form>

        <el-button type="primary" class="btn" @click="handleAddAddress">保存</el-button>
    </div>
</template>

<script>

export default {
    data() {
        return {
            tableData: [],
            upDateAddress : true,
            formLabelAlign: {
                recv_name: '',
                address: '',
                recv_telphone: ''
            }
        };
    },

    methods: {
        deleteRow(index, rows) {
            const data = {
                address_id : rows[index].address_id
            }
            this.$axios
                .post('/api/address/delete', data)
                .then(res => {
                    console.log(res)
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.$store.dispatch('asyncRemoveAddress', index)
                        this.$message({
                            showClose: true,
                            message: '地址已删除',
                            type: 'success',
                            duration: 1500
                        });
                    }
                })
        },
        handleAddAddress() {
            console.log(this.formLabelAlign)
            this.$axios
                .post('/api/address/add', this.formLabelAlign)
                .then(res => {
                    console.log(res)
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.$message({
                            showClose: true,
                            message: '地址添加成功',
                            type: 'success',
                            duration: 1500
                        });
                        this.formLabelAlign = {
                            recv_name: '',
                            address: '',
                            recv_telphone: ''
                        }
                        this.getAddressData()
                    }
                })
        },
        // 获取地址数据
        getAddressData () {
            this.$axios
                .get('/api/address/get')
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.$store.state.addressList = res.data.Data
                    }
                })
        }
    },
    created() {
        this.getAddressData()
    },
};
</script>

<style scoped lang='stylus'>
.address >>> .el-button--primary
    background-color #333
    color #fff
    outline none
    border none
    &:hover
        background-color #444
.address
    padding 15px
    & > P:nth-of-type(2)
        margin-top 50px
    p 
        border-bottom: 1px solid #ccc;
        height: 30px;
        padding: 5px;
        box-sizing: border-box;
        margin-bottom: 20px;
        font-weight: bold;

.btn
    margin-top 10px
</style>