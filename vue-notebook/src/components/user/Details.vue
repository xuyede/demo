<template>
    <div class="details">
        <div class="show-details" v-show="showDetails">
            <p class="show-title">账号信息</p>
            <table class="table-show">
                <tr>
                    <td>用户名</td>
                    <td>{{ renderData.username }}</td>
                </tr>
                <tr>
                    <td>密码</td>
                    <td>{{ renderData.password }}</td>
                </tr>
                <tr>
                    <td>电话号码</td>
                    <td>{{ renderData.telphone }}</td>
                </tr>
                <tr>
                    <td>性别</td>
                    <td>{{ renderData.sex }}</td>
                </tr>
                <tr>
                    <td>描述</td>
                    <td>{{ renderData.description }}</td>
                </tr>
            </table>
            <el-button type="primary" class="btn" @click="handleShowBtn">修改</el-button>
        </div>
        <div class="update-details" v-show="updateDetails" ref="update">
            <p class="update-title">修改账号信息</p>
            <p>
                <label for="username">用户名</label>
                <input type="text" id="username" :value="renderData.username">
            </p>
            <p>
                <label for="password">密码</label>
                <input type="text" id="password" :value="renderData.password">
            </p>
            <p>
                <label for="telphone">电话号码</label>
                <input type="text" id="telphone" :value="renderData.telphone">
            </p>
            <p>
                <label for="sex">性别 </label>
                <input type="text" id="sex" :value="renderData.sex">
            </p>
            <p>
                <label for="description">描述</label>
                <input type="text" id="description" :value="renderData.description">
            </p>
            <button @click="handleUpdateBtn">确认</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            renderData: {
                username: '',
                password: '',
                telphone: '',
                sex: '',
                description: ''
            },
            showDetails: true,
            updateDetails: false,
        };
    },
    methods: {
        // 进入修改个人信息列表
        handleShowBtn() {
            this.showDetails = false;
            this.updateDetails = true;
        },
        // 更新个人信息
        handleUpdateBtn() {
            const oWrap = this.$refs.update;
            const aInp = oWrap.getElementsByTagName("input");
            const data = {};
            const oKey = Object.keys(this.renderData);
            for (let i = 0; i < aInp.length; i++) {
                data[oKey[i]] = aInp[i].value;
            }

            this.$axios
                .post("/api/user/update", data)
                .then(res => {
                    if (res.data.Code === this.$store.state.isSuccessResp) {
                        this.updateData();
                    }
                });
        },
        // 重新渲染个人信息
        updateData() {
            this.$axios
                .get("/api/user/get")
                .then(res => {
                    this.renderData = res.data.Data[0]
                    this.updateDetails = false;
                    this.showDetails = true;
                });
        }
    },
    mounted() {
        this.$axios
            .get('/api/user/get')
            .then(res => this.renderData = res.data.Data[0])
    }
};
</script>

<style scoped lang='stylus'>
.details >>> .el-button--primary
    background-color #333
    color #fff
    outline none
    border none
    &:hover
        background-color #444
.details {
    padding: 15px;
}

.show-details {
    width: 100%;

    .show-title {
        border-bottom: 1px solid #ccc;
        font-weight: bold;
        height: 30px;
        padding: 5px;
        box-sizing: border-box;
    }

    .table-show{
        width 100%
        margin-top 10px
        border-collapse:collapse;
        tr{
            height 57px
            background-color #ffffff
            border-bottom:1px solid #eee;
            line-height 57px
            & > :nth-child(1) {
                width 150px
                text-align right
                padding-right 30px
                border-right 1px solid #eee
            }
            & > :nth-child(2) {
                text-align left
                padding-left 50px
            }
            td{
                box-sizing border-box
            }
        }
    }

    .btn{
        margin-top 10px
    }
}

.update-details {
    width: 100%;

    .update-title {
        border-bottom: 1px solid #ccc;
    }

    p {
        height: 30px;
        padding: 5px;
        // box-sizing border-box
    }

    label {
        display: inline-block;
        vertical-align: top;
        width: 70px;
        height: 30px;
        text-align: right;
        margin-right: 10px;
        line-height: 30px;
    }

    input {
        height: 30px;
        width: 70%;
        border: none;
        outline: none;
        padding-left: 10px;
        font-size: 13px;
    }

    button {
        width: 50px;
        height: 30px;
        outline: none;
        border: none;
        color: #ffffff;
        background-color: #333;
        border-radius: 5px;
        margin-left: 25px;
        cursor: pointer;

        &:hover {
            background-color: #444;
        }
    }
}
</style>