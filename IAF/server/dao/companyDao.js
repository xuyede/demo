const { createConnection } = require('./daoUtil.js');
const { promisify } = require('util');
const moment = require('moment');
const { handleRound, handleTag } = require('../util/initTargetProp');

// connection.query Promise化
const connection = createConnection();
const queryAsync = promisify(connection.query.bind(connection));
// sql查询语句
const sqlQueryCompanyCount = 'select count(1) as count from company;';
const sqlQueryCompanyByLimit = 'select * from company limit ?, ?;';
const sqlQueryCompanyTimeStamp = 'select create_time from company;';
const sqlQueryCompanyRecommend = 'select * from company order by create_time desc limit 0,5;';
const sqlQueryCompanyAll = 'select * from company';
const sqlQueryCompanyTag = 'select tag from company;';
const sqlQueryCompanyRound = 'select round from company;';
const sqlQueryCompanyState = 'select state from company;';
const sqlQueryCompanyChart = 'select count(1) as count from company where round = ? and tag = ?';
const sqlQueryCompanyByName = 'select * from company where com_name = ?';
const sqlQueryCompanySearch = 'select * from company where com_name like ? limit ?, ?;';
const sqlQueryCompanySearchCount = 'select count(1) as count from company where com_name like ?';
const sqlQueryCompanyEventById = 'select * from event where com_id = ?';
const sqlQueryCompanyById = 'select * from company where com_id = ?';


// console.log(`companyDao.js:queryRecommendCompany --- ${e}`);


const dealData = data => {
    return data
        .map( async e => {
            const { invest_event, com_id } = e;

            if (com_id <= 10) {
                const events = invest_event.split(',') || [];
                let sqlBase = '';
                if (events.length > 0)
                    events.forEach((e, i) => {
                        if (i === 0) sqlBase = 'select * from company_event where id = ?';
                        else sqlBase += ' or id = ?'
                    });
                sqlBase += ';';

                e['invest_event'] = await queryAsync(sqlBase, events);
            }

            e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD');
            return e
        });
};

// 查询公司状态(state)
const queryAllCompanyState = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let states = await queryAsync(sqlQueryCompanyState);
        success(states);
    } catch (e) {
        console.log(`companyDao.js:queryAllCompanyState--- ${e}`);
    }
    connection.end();
};

// 查询公司轮次(round)
let roundCount = 0;
const queryAllCompanyRound = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let rounds = await queryAsync(sqlQueryCompanyRound);
        roundCount = handleRound(rounds).slice(1).length;
        success(rounds);
    } catch (e) {
        console.log(`companyDao.js:queryAllCompanyRound--- ${e}`);
    }
    connection.end();
};

let tagCount = 0;
// 查询公司类型(tag)
const queryAllCompanyTag = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let tags = await queryAsync(sqlQueryCompanyTag);
        tagCount = handleTag(tags).slice(1).length;
        success(tags);
    } catch (e) {
        console.log(`companyDao.js:queryAllCompanyTag--- ${e}`);
    }
    connection.end();
};


// 查询公司表的chart数据
let number = 0;
let isChartCloseConnect = true;
let connectionChart;
const queryCompanyChart = async (round, tag, success) => {
    if (isChartCloseConnect) {
        isChartCloseConnect = false;
        connectionChart = createConnection();
        connectionChart.connect();
    }

    try {
        let count = (await queryAsync(sqlQueryCompanyChart, [round, tag]))[0]['count'];
        success(null, count);
        if (++number >= tagCount * roundCount) {
            number = 0;
            console.log('chart done');
            connectionChart.end();
            isChartCloseConnect = true;
        }
    } catch (e) {
        console.log(`companyDao.js:queryAllCompanyState--- ${e}`);
    }
};

// 根据公司ID获取事件
let count = 0;
let isCloseConnect = true;
let connectionId;
const queryCompanyByID500 = async (id, success) => {
    if (isCloseConnect) {
        isCloseConnect = false;
        connectionId = createConnection();
        connectionId.connect();
    }

    try {
        let result = await queryAsync(sqlQueryCompanyEventById, [id]);
        success(null, result);
        if (++count >= 500) {
            count = 0;
            console.log('id done');
            connectionId.end();
            isCloseConnect = true;
        }
    } catch (e) {
        console.log(`companyDao.js:queryCompanyByID500--- ${e}`);
    }
};

const queryCompanyByID = async (id, success) => {
    const connection = createConnection();
    connection.connect();

    try {
        let result = await queryAsync(sqlQueryCompanyEventById, [id]);
        success(null, result);
    } catch (e) {
        console.log(`companyDao.js:queryCompanyByID--- ${e}`);
    }
    connection.end();
};

//查询公司时间戳(create_time)
const queryAllCompanyTimeStamp = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let times = await queryAsync(sqlQueryCompanyTimeStamp);
        success(times);
    } catch (e) {
        console.log(`companyDao.js:queryAllCompanyTimeStamp--- ${e}`);
    }
    connection.end();
};

//分页查询公司表数据(20)
const queryCompanyByLimit = async (page, limit, success) => {
    const connection = createConnection();
    connection.connect();

    let offset = (page - 1) * limit;
    let result;
    try {
        result = await queryAsync(sqlQueryCompanyByLimit, [offset, limit]);
        let retPromise = dealData(result);

        Promise.all(retPromise)
            .then(ret => success(null, ret));
    } catch (e) {
        console.log(`companyDao.js:queryCompanyByLimit--- ${e}`);
    }
    connection.end();
};

//查询公司表数据总数
const queryCompanyCount = async success => {
    const connection = createConnection();
    connection.connect();
    try {
        let count = (await queryAsync(sqlQueryCompanyCount))[0]['count'];
        success(null, count);
    } catch (e) {
        console.log(`companyDao.js:queryCompanyCount --- ${e}`);
    }
    connection.end()
};

// 获取公司全部数据
const queryCompanyAll = async success => {
    const connection = createConnection();
    connection.connect();

    let result;
    try {
        result = await queryAsync(sqlQueryCompanyAll);
    } catch (e) {
        console.log(`companyDao.js:queryCompanyAll --- ${e}`);
    }

    let retPromise = dealData(result);

    Promise.all(retPromise)
        .then(ret => success(ret));

    connection.end()
};

// 查询公司推荐
const queryRecommendCompany = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let recommendCompData = await queryAsync(sqlQueryCompanyRecommend);
        success(recommendCompData)
    } catch (e) {
        console.log(`companyDao.js:queryRecommendCompany --- ${e}`);
    }
    connection.end()
};

// 根据筛选区间获取公司数据
const queryCompanyBySection = async (sqlScript, paramsList, page, success) => {
    const connection = createConnection();
    connection.connect();

    const limit = 20;
    const offset = limit * (page - 1);
    paramsList.push(offset, limit);
    sqlScript += ` limit ?, ?;`;

    try {
        let result = await queryAsync(sqlScript, paramsList);
        let retPromise = dealData(result);

        Promise.all(retPromise)
            .then(ret => success(null, ret));
    } catch (e) {
        console.log(`companyDao.js:queryCompanyBySection--- ${e}`);
    }

    connection.end();
};

// 根据筛选区间获取公司数据数量
const queryCompanyCountBySection = async (sqlScript, paramsList, success) => {
    const connection = createConnection();
    connection.connect();

    sqlScript = sqlScript.replace(/\*/g, 'count(1) as count');
    sqlScript += ';';

    try {
        let count = await queryAsync(sqlScript, paramsList);
        success(null, count[0]['count']);
    } catch (e) {
        console.log(`companyDao.js:queryCompanyCountBySection--- ${e}`);
    }

    connection.end();
};

// 区间获取数据
const queryCompanyByLimitSimple = async (offset, limit, success) => {
    const connection = createConnection();
    connection.connect();

    let result;
    try {
        result = await queryAsync(sqlQueryCompanyByLimit, [offset, limit]);
        let retPromise = dealData(result);

        Promise.all(retPromise)
            .then(ret => success(null, ret));
    } catch (e) {
        console.log(`companyDao.js:queryCompanyByLimitSimple--- ${e}`);
    }
    connection.end();
};

// 根据名字查询数据
const queryCompanyByName = async (name, success) => {
    const connection = createConnection();
    connection.connect();

    try {
        let result = await queryAsync(sqlQueryCompanyByName, [name]);
        let retPromise = dealData(result);

        Promise.all(retPromise)
            .then(ret => success(null, ret));
    } catch (e) {
        console.log(`companyDao.js:queryCompanyByName--- ${e}`);
    }

    connection.end();
};

// 公司表的模糊查找
const queryCompanySearch = async (page = 1, limit = 5, value, success) => {
    const connection = createConnection();
    connection.connect();

    let offset = (page - 1) * limit;

    value = `%${value}%`;

    try {
        let compData = await queryAsync(sqlQueryCompanySearch, [value, offset, limit]);
        let compCount = await queryAsync(sqlQueryCompanySearchCount, value);

        let retPromise = dealData(compData);

        Promise.all(retPromise)
            .then(ret => {
                let result = {
                    count : compCount[0].count,
                    data : ret
                };

                success(null, result)
            });

    } catch (e) {
        console.log(`companyDao.js:queryCompanySearch --- ${e}`);
    }
    connection.end()
};



// 根据公司ID获取公司数据
const queryCompanyByID1 = async (id, success) => {
    const connection = createConnection();
    connection.connect();

    try {
        let result = await queryAsync(sqlQueryCompanyById, [id]);
        let retPromise = dealData(result);

        Promise.all(retPromise)
            .then(ret => success(null, ret));
    } catch (e) {
        console.log(`companyDao.js:queryCompanyByID1--- ${e}`);
    }

    connection.end();
};

module.exports = {
    'queryRecommendCompany' : queryRecommendCompany,
    'queryCompanyAll' : queryCompanyAll,
    'queryCompanyCount' : queryCompanyCount,
    'queryCompanyByLimit' : queryCompanyByLimit,
    'queryAllCompanyTimeStamp' : queryAllCompanyTimeStamp,
    'queryAllCompanyTag' : queryAllCompanyTag,
    'queryAllCompanyRound' : queryAllCompanyRound,
    'queryAllCompanyState' : queryAllCompanyState,
    'queryCompanyBySection' : queryCompanyBySection,
    'queryCompanyCountBySection' : queryCompanyCountBySection,
    'queryCompanyChart' : queryCompanyChart,
    'queryCompanyByLimitSimple' : queryCompanyByLimitSimple,
    'queryCompanyByName' : queryCompanyByName,
    'queryCompanySearch' : queryCompanySearch,
    'queryCompanyByID' : queryCompanyByID,
    'queryCompanyByID1' : queryCompanyByID1,
    'queryCompanyByID500' : queryCompanyByID500
};
















