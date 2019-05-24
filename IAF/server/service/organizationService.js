const {
    queryOrgRecommend,
    queryOrgAll,
    queryOrgByLimit,
    queryOrgCount,
    queryAllOrgType,
    queryAllOrgTimeStamp,
    queryAllOrgInvestTag,
    queryAllOrgInvestRound,
    queryOrgBySection,
    queryOrgCountBySection,
    queryOrgByLimitSimple,
    queryOrgByName,
    queryOrgSearch,
    queryOrgEventByBelong,
    queryOrgByInvestEvent,
    queryOrgEventById,
    queryOrgNotNormal,
    queryCompanyByID500
} = require('../dao/organizationDao');

const {
    handelTimeStamp,
    handleType,
    handleTag,
    handleRound
} = require('../util/initTargetProp');

// 根据机构时间戳区间查询数据
const serviceQueryOrgBySection = (sqlScript, paramsList, page, success) => {
    queryOrgBySection(sqlScript, paramsList, page, success);
};
// 根据机构时间戳区间获取数量
const serviceQueryOrgCountBySection = (sqlScript, paramsList, success) => {
    queryOrgCountBySection(sqlScript, paramsList, success);
};

// 获取机构投资对象的轮次(round)
const serviceQueryAllOrgInvestRound = success => {
    queryAllOrgInvestRound( tag => {
        let result = handleRound(tag);
        success(null, result);
    })
};

// 获取机构投资对象的类型(tag)
const serviceQueryAllOrgInvestTag = success => {
    queryAllOrgInvestTag( tag => {
        let result = handleTag(tag);
        success(null, result);
    })
};

// 获取机构时间戳(create_name)
const serviceQueryAllOrgTimeStamp = success => {
    queryAllOrgTimeStamp( timeStamp => {
        let result = handelTimeStamp(timeStamp);
        success(null, result);
    })
};

// 获取机构类型(prg_type)
const serviceQueryAllOrgType = success => {
    queryAllOrgType( type => {
        let result = handleType(type);
        success(null, result);
    })
};

// 获取机构表数据总数
const serviceQueryOrgCount = success => {
    queryOrgCount(success)
};

// 机构分页获取数据(20)
const serviceQueryOrgByLimit = (page, limit, success) => {
    queryOrgByLimit(page, limit, success)
};

// 获取全部机构数据
const serviceQueryOrgAll = success => {
    queryOrgAll(success)
};

// 机构推荐
const serviceQueryOrgRecommend = success => {
    queryOrgRecommend(success)
};

// 区间获取数据
const serviceQueryOrgByLimitSimple = (offset, limit, success) => {
    queryOrgByLimitSimple(offset, limit, success)
};

// 机构名称获取数据
const serviceQueryOrgByName = (name, success) => {
    queryOrgByName(name, success);
};

// 机构的搜索
const serviceQueryOrgSearch = (page, limit, value, success) => {
    queryOrgSearch(page, limit, value, success);
};

// 获取投资事件的所属
const serviceQueryOrgEventByBelong = (sqlScript, paramsList, success) => {
    queryOrgEventByBelong(sqlScript, paramsList, success)
};

// 获取有投资事件得机构
const serviceQueryOrgByInvestEvent = success => {
    queryOrgByInvestEvent(success)
};

// 获取机构的事件
const serviceQueryOrgEventById = (id, success) => {
    queryOrgEventById(id, success)
};

// 获取不是假数据的公司数据
const serviceQueryOrgNotNormal = success => {
    queryOrgNotNormal(success)
};

// 获取机构的事件, 长连接
const serviceQueryCompanyByID500 = (id, sum, success) => {
    queryCompanyByID500(id, sum, success)
};

module.exports = {
    'serviceQueryOrgRecommend' : serviceQueryOrgRecommend,
    'serviceQueryOrgAll' : serviceQueryOrgAll,
    'serviceQueryOrgByLimit' : serviceQueryOrgByLimit,
    'serviceQueryOrgCount' : serviceQueryOrgCount,
    'serviceQueryAllOrgType' : serviceQueryAllOrgType,
    'serviceQueryAllOrgTimeStamp' : serviceQueryAllOrgTimeStamp,
    'serviceQueryAllOrgInvestTag' : serviceQueryAllOrgInvestTag,
    'serviceQueryAllOrgInvestRound' : serviceQueryAllOrgInvestRound,
    'serviceQueryOrgBySection' : serviceQueryOrgBySection,
    'serviceQueryOrgCountBySection' : serviceQueryOrgCountBySection,
    'serviceQueryOrgByLimitSimple' : serviceQueryOrgByLimitSimple,
    'serviceQueryOrgByName' : serviceQueryOrgByName,
    'serviceQueryOrgSearch' : serviceQueryOrgSearch,
    'serviceQueryOrgEventByBelong' : serviceQueryOrgEventByBelong,
    'serviceQueryOrgByInvestEvent' : serviceQueryOrgByInvestEvent,
    'serviceQueryOrgEventById' : serviceQueryOrgEventById,
    'serviceQueryOrgNotNormal' : serviceQueryOrgNotNormal,
    'serviceQueryCompanyByID500' : serviceQueryCompanyByID500
};









