const {
    queryRecommendNewsLimit,
    queryNewsCount,
    queryNewsByLimit,
    queryAllNewsTimeStamp,
    queryAllNewsTag,
    queryNewsBySection,
    queryNewsCountBySection,
    queryNewsSearch
} = require('../dao/newsDao.js');

const {
    handelTimeStamp,
    handleTag,
    handleField
} = require('../util/initTargetProp');

// 新闻推荐
const serviceQueryRecommendNewsLimit = (limit, success) => {
    queryRecommendNewsLimit(limit, success);
};
// 新闻数据总数
const serviceQueryNewsCount = success => {
    queryNewsCount(success);
};
// 新闻分页查询
const serviceQueryNewsByLimit = (page, limit, success) => {
    queryNewsByLimit(page, limit, success)
};
// 查询新闻时间戳
const serviceQueryAllNewsTimeStamp = success => {
    queryAllNewsTimeStamp( timeStamp => {
        let result = handelTimeStamp(timeStamp);
        success(null, result);
    })
};
// 查询新闻类型
const serviceQueryAllNewsTag = success => {
    queryAllNewsTag( tag => {
        let result = handleField(tag);
        success(null, result);
    })
};
// 根据新闻时间戳区间查询数据
const serviceQueryNewsBySection = (sqlScript, paramsList, page, success) => {
    queryNewsBySection(sqlScript, paramsList, page, success);
};
// 根据新闻时间戳区间获取新闻数量
const serviceQueryNewsCountBySection = (sqlScript, paramsList, success) => {
    queryNewsCountBySection(sqlScript, paramsList, success);
};
// 新闻模糊查询, 20条数据
const serviceQueryNewsSearch = (page, limit, value, success) => {
    queryNewsSearch(page, limit, value, success)
};



module.exports = {
    'serviceQueryRecommendNewsLimit' : serviceQueryRecommendNewsLimit,
    'serviceQueryNewsCount' : serviceQueryNewsCount,
    'serviceQueryNewsByLimit' : serviceQueryNewsByLimit,
    'serviceQueryAllNewsTimeStamp' : serviceQueryAllNewsTimeStamp,
    'serviceQueryAllNewsTag' : serviceQueryAllNewsTag,
    'serviceQueryNewsBySection' : serviceQueryNewsBySection,
    'serviceQueryNewsCountBySection' : serviceQueryNewsCountBySection,
    'serviceQueryNewsSearch' : serviceQueryNewsSearch
};

