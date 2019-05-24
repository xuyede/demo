const {
    queryRecommendCompany,
    queryCompanyAll,
    queryCompanyCount,
    queryCompanyByLimit,
    queryAllCompanyTimeStamp,
    queryAllCompanyTag,
    queryAllCompanyRound,
    queryAllCompanyState,
    queryCompanyCountBySection,
    queryCompanyBySection,
    queryCompanyChart,
    queryCompanyByLimitSimple,
    queryCompanyByName,
    queryCompanySearch,
    queryCompanyByID,
    queryCompanyByID1,
    queryCompanyByID500
} = require('../dao/companyDao');

const {
    handelTimeStamp,
    handleTag,
    handleRound,
    handleState
} = require('../util/initTargetProp');

// 获取公司chart数据
const serviceQueryCompanyChart = (round, tag, success) => {
    queryCompanyChart(round, tag, success)
};

// 根据公司时间戳区间查询数据
const serviceQueryCompanyBySection = (sqlScript, paramsList, page, success) => {
    queryCompanyBySection(sqlScript, paramsList, page, success);
};
// 根据公司时间戳区间获取数量
const serviceQueryCompanyCountBySection = (sqlScript, paramsList, success) => {
    queryCompanyCountBySection(sqlScript, paramsList, success);
};

// 获取公司全部轮次
const serviceQueryAllCompanyRound = success => {
    queryAllCompanyRound( timeStamp => {
        let result = handleRound(timeStamp);
        success(null, result);
    })
};

// 获取公司全部状态
const serviceQueryAllCompanyState = success => {
    queryAllCompanyState( timeStamp => {
        let result = handleState(timeStamp);
        success(null, result);
    })
};

// 获取公司全部时间戳
const serviceQueryAllCompanyTimeStamp = success => {
    queryAllCompanyTimeStamp( timeStamp => {
        let result = handelTimeStamp(timeStamp);
        success(null, result);
    })
};

// 获取公司全部类型
const serviceQueryAllCompanyTag = success => {
    queryAllCompanyTag( tag => {
        let result = handleTag(tag);
        success(null, result);
    })
};

// 公司分页查询(20)
const serviceQueryCompanyByLimit = (page, limit, success) => {
    queryCompanyByLimit(page, limit, success)
};

// 公司数据总数
const serviceQueryCompanyCount = success => {
    queryCompanyCount(success)
};

// 公司全部数据
const serviceQueryCompanyAll = success => {
    queryCompanyAll( data => {
        success(null, data)
    })
};

// 公司推荐
const serviceQueryRecommendCompany = success => {
    queryRecommendCompany(success);
};

// 区间获取数据
const serviceQueryCompanyByLimitSimple = (offset, limit, success) => {
    queryCompanyByLimitSimple(offset, limit, success)
};

// 公司名称获取数据
const serviceQueryCompanyByName = (name, success) => {
    queryCompanyByName(name, success);
};

// 公司表模糊查找
const serviceQueryCompanySearch = (page, limit, value, success) => {
    queryCompanySearch(page, limit, value, success);
};

// 获取公司的投资事件
const serviceQueryCompanyByID = (id, success) => {
    queryCompanyByID(id, success)
};

// 获取公司数据
const serviceQueryCompanyByID1 = (id, success) => {
    queryCompanyByID1(id, success)
};

// 公司下载500条数据
const serviceQueryCompanyByID500 = (id, success) => {
    queryCompanyByID500(id, success)
};

module.exports = {
    'serviceQueryRecommendCompany' : serviceQueryRecommendCompany,
    'serviceQueryCompanyAll' : serviceQueryCompanyAll,
    'serviceQueryCompanyCount' : serviceQueryCompanyCount,
    'serviceQueryCompanyByLimit' : serviceQueryCompanyByLimit,
    'serviceQueryAllCompanyTimeStamp' : serviceQueryAllCompanyTimeStamp,
    'serviceQueryAllCompanyTag' : serviceQueryAllCompanyTag,
    'serviceQueryAllCompanyRound' : serviceQueryAllCompanyRound,
    'serviceQueryAllCompanyState' : serviceQueryAllCompanyState,
    'serviceQueryCompanyBySection' : serviceQueryCompanyBySection,
    'serviceQueryCompanyCountBySection' : serviceQueryCompanyCountBySection,
    'serviceQueryCompanyChart' : serviceQueryCompanyChart,
    'serviceQueryCompanyByLimitSimple' : serviceQueryCompanyByLimitSimple,
    'serviceQueryCompanyByName' : serviceQueryCompanyByName,
    'serviceQueryCompanySearch' : serviceQueryCompanySearch,
    'serviceQueryCompanyByID' : serviceQueryCompanyByID,
    'serviceQueryCompanyByID1' : serviceQueryCompanyByID1,
    'serviceQueryCompanyByID500' : serviceQueryCompanyByID500
};


