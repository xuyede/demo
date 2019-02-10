import Vue from 'vue'
import { 
    Button, 
    Table, 
    Message, 
    Collapse, 
    CollapseItem,
    Tag,
    Pagination,
    TableColumn,
    Rate,
    InputNumber,
    Loading,
    Form,
    FormItem,
    Input,
    Step,
    Steps,
    Radio
} from 'element-ui'

Vue.use(Button)
Vue.use(Table)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(TableColumn)
Vue.use(Rate)
Vue.use(InputNumber)
Vue.use(Loading.directive)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Radio)

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;