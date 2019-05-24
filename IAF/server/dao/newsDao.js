const { createConnection } = require('./daoUtil.js');
const { promisify } = require('util');

// connection.query Promise化
const connection = createConnection();
const queryAsync = promisify(connection.query.bind(connection));
// sql查询语句
const sqlQueryNewsCount = 'select count(1) as count from news;';
const sqlQueryNewsByLimit = 'select * from news limit ?, ?;';
const sqlQueryNewsTimeStamp = 'select create_time from news;';
const sqlQueryNewsTag = 'select field from news;';
const sqlQueryNewsSearch = 'select * from news where title like ? limit ?, ?;';
const sqlQueryNewsSearchCount = 'select count(1) as count from news where title like ?';

// 查询新闻表数据总数
const queryNewsCount = async success => {
    const connection = createConnection();
    connection.connect();
    try {
        let count = (await queryAsync(sqlQueryNewsCount))[0]['count'];
        success(null, count);
    } catch (e) {
        console.log(`newsDao.js:queryNewsCount --- ${e}`);
    }
    connection.end()
};
// 查询推荐新闻列表
const queryRecommendNewsLimit = async (limit, success) => {
    const connection = createConnection();
    connection.connect();
    let count, offset;

    try {
        let result = await queryAsync(sqlQueryNewsCount);
        count =  result[0]['count'];
        offset = Math.floor(Math.random() * (count - limit));
    } catch (e) {}


    try {
        let recommendNewsData = await queryAsync(sqlQueryNewsByLimit, [offset, limit]);
        success(recommendNewsData);
    } catch (e) {
        console.log(`newsDao.js:queryRecommendNewsLimit --- ${e}`);
    }
    connection.end();
};
// 分页查询新闻表数据(20)
const queryNewsByLimit = async (page, limit, success) => {
    const connection = createConnection();
    connection.connect();

    let offset = (page - 1) * limit;

    try {
        let newsData = await queryAsync(sqlQueryNewsByLimit, [offset, limit]);
        success(null, newsData);
    } catch (e) {
        console.log(`newsDao.js:queryNewsByLimit--- ${e}`);
    }
    connection.end();
};
// 查询新闻时间戳(create_time)
const queryAllNewsTimeStamp = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let times = await queryAsync(sqlQueryNewsTimeStamp);
        success(times);
    } catch (e) {
        console.log(`newsDao.js:queryAllNewsCreateTime--- ${e}`);
    }
    connection.end();
};
// 查询新闻类型(tag)
const queryAllNewsTag = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let tags = await queryAsync(sqlQueryNewsTag);
        success(tags);
    } catch (e) {
        console.log(`newsDao.js:queryAllNewsTag--- ${e}`);
    }
    connection.end();
};
// 根据筛选区间获取新闻数据
const queryNewsBySection = async (sqlScript, paramsList, page, success) => {
    const connection = createConnection();
    connection.connect();

    const limit = 20;
    const offset = limit * (page - 1);
    paramsList.push(offset, limit);
    sqlScript += ` limit ?, ?;`;

    try {
        let news = await queryAsync(sqlScript, paramsList);
        success(null, news);
    } catch (e) {
        console.log(`newsDao.js:queryNewsBySection--- ${e}`);
    }

    connection.end();
};
// 根据筛选区间获取新闻数据总数
const queryNewsCountBySection = async (sqlScript, paramsList, success) => {
    const connection = createConnection();
    connection.connect();

    sqlScript = sqlScript.replace(/\*/g, 'count(1) as count');
    sqlScript += ';';

    try {
        let count = await queryAsync(sqlScript, paramsList);
        success(null, count[0]['count']);
    } catch (e) {
        console.log(`newsDao.js:queryNewsCountBySection--- ${e}`);
    }

    connection.end();
};
// 新闻模糊查询,分页返回
const queryNewsSearch = async (page, limit, value, success) => {
    const connection = createConnection();
    connection.connect();

    let offset = (page - 1) * limit;

    value = `%${value}%`;

    try {
        let newsData = await queryAsync(sqlQueryNewsSearch, [value, offset, limit]);
        let newsCount = await queryAsync(sqlQueryNewsSearchCount, value);
        let result = {
            count : newsCount[0].count,
            data : newsData
        };
        success(null, result);
    } catch (e) {
        console.log(`newsDao.js:queryNewsSearch--- ${e}`);
    }
    connection.end()
};

module.exports = {
    'queryRecommendNewsLimit' : queryRecommendNewsLimit,
    'queryNewsCount' : queryNewsCount,
    'queryNewsByLimit' : queryNewsByLimit,
    'queryAllNewsTimeStamp' : queryAllNewsTimeStamp,
    'queryAllNewsTag' : queryAllNewsTag,
    'queryNewsBySection' : queryNewsBySection,
    'queryNewsCountBySection' : queryNewsCountBySection,
    'queryNewsSearch' : queryNewsSearch
};


