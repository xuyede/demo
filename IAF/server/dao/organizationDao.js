const { createConnection } = require('./daoUtil.js');
const { promisify } = require('util');
const moment = require('moment');

// connection.query Promise化
const connection = createConnection();
const queryAsync = promisify(connection.query.bind(connection));
// sql语句
const sqlQueryOrgRecommend = 'select * from organization order by create_time desc limit 0,5;';
const sqlQueryOrgAll = 'select * from organization;';
const sqlQueryOrgInvestEvent = 'select * from organization where invest_event != \'null\';';
const sqlQueryOrgByLimit = 'select * from organization limit ?, ?;';
const sqlQueryOrgCount = 'select count(1) as count from organization;';
const sqlQueryOrgType = 'select org_type from organization;';
const sqlQueryOrgTimeStamp = 'select create_time from organization;';
const sqlQueryOrgInvestTag = 'select tag from organization_event';
const sqlQueryOrgInvestRound = 'select round from organization_event';
const sqlQueryOrgByName = 'select * from organization where org_name = ?';
const sqlQueryOrgSearch = 'select * from organization where org_name like ? limit ?, ?;';
const sqlQueryOrgSearchCount = 'select count(1) as count from organization where org_name like ?';
const sqlQueryOrgEventById = 'select * from event where org_id = ?';
const sqlQueryOrgNotNormal = 'select * from organization where org_name not like ?';

// console.log(`organizationDao.js:queryOrgRecommend --- ${e}`);

// 处理数据中的事件/时间格式
const dealData = data => {
    return data
        .map( async e => {
            const { invest_event } = e;
            const events = invest_event && invest_event.split(',') || undefined;
            let sqlBase = '';
            events && events.forEach((e, i) => {
                if (i === 0) sqlBase = 'select * from organization_event where id = ?';
                else sqlBase += ' or id = ?'
            });
            sqlBase += ';';

            e['invest_event'] = events && await queryAsync(sqlBase, events) || '';
            e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD');
            return e
        });
};

// 查询投资事件的belong
const queryOrgEventByBelong = async (sqlScript, paramsList, success) => {
    const connection = createConnection();
    connection.connect();

    try {
        let result = await queryAsync(sqlScript, paramsList);
        success(null, result)
    } catch (e) {
        console.log(`organizationDao.js:queryOrgEventByBelong--- ${e}`);
    }

    connection.end();
};

// 根据筛选区间获取公司数据
const queryOrgBySection = async (sqlScript, paramsList, page, success) => {
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
        console.log(`organizationDao.js:queryOrgBySection--- ${e}`);
    }

    connection.end();
};

// 根据筛选区间获取公司数据数量
const queryOrgCountBySection = async (sqlScript, paramsList, success) => {
    const connection = createConnection();
    connection.connect();

    sqlScript = sqlScript.replace(/\*/g, 'count(1) as count');
    sqlScript += ';';

    try {
        let count = await queryAsync(sqlScript, paramsList);
        success(null, count[0]['count']);
    } catch (e) {
        console.log(`organizationDao.js:queryOrgCountBySection--- ${e}`);
    }

    connection.end();
};

// 查询机构投资对象的所有round(round)
const queryAllOrgInvestRound = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let tags = await queryAsync(sqlQueryOrgInvestRound);
        success(tags);
    } catch (e) {
        console.log(`organizationDao.js:queryAllOrgInvestRound --- ${e}`);
    }
    connection.end();
};

// 查询机构投资对象所有tag(tag)
const queryAllOrgInvestTag = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let tags = await queryAsync(sqlQueryOrgInvestTag);
        success(tags);
    } catch (e) {
        console.log(`organizationDao.js:queryAllOrgInvestTag --- ${e}`);
    }
    connection.end();
};

// 查询机构时间戳(create_name)
const queryAllOrgTimeStamp = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let times = await queryAsync(sqlQueryOrgTimeStamp);
        success(times);
    } catch (e) {
        console.log(`organizationDao.js:queryAllOrgTimeStamp --- ${e}`);
    }
    connection.end();
};

// 查询机构类型(org_type)
const queryAllOrgType = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let tags = await queryAsync(sqlQueryOrgType);
        success(tags);
    } catch (e) {
        console.log(`organizationDao.js:queryAllOrgType --- ${e}`);
    }
    connection.end();
};

// 查询机构表数据总数
const queryOrgCount = async success => {
    const connection = createConnection();
    connection.connect();
    try {
        let count = (await queryAsync(sqlQueryOrgCount))[0]['count'];
        success(null, count);
    } catch (e) {
        console.log(`organizationDao.js:queryOrgcount --- ${e}`);
    }
    connection.end()
};

// 分页查询机构数据(20)
const queryOrgByLimit = async (page, limit, success) => {
    const connection = createConnection();
    connection.connect();

    let offset = (page - 1) * limit;
    let result;
    try {
        result = await queryAsync(sqlQueryOrgByLimit, [offset, limit]);
        let retPromise = dealData(result);

        Promise.all(retPromise)
            .then(ret => success(null, ret));
    } catch (e) {
        console.log(`organizationDao.js:queryOrgByLimit --- ${e}`);
    }
    connection.end();
};

// 查询机构全部数据
const queryOrgAll = async success => {
    const connection = createConnection();
    connection.connect();

    let result;
    try {
        result = await queryAsync(sqlQueryOrgAll);
    } catch (e) {
        console.log(`organizationDao.js:queryOrgAll --- ${e}`);
    }

    let retPromise = dealData(result);

    Promise.all(retPromise)
        .then(ret => success(null, ret));

    connection.end()
};

// 查询有投资事件得全部数据
const queryOrgByInvestEvent = async success => {
    const connection = createConnection();
    connection.connect();

    let result;
    try {
        result = await queryAsync(sqlQueryOrgInvestEvent);
    } catch (e) {
        console.log(`organizationDao.js:queryOrgByInvestEvent --- ${e}`);
    }

    let retPromise = dealData(result);

    Promise.all(retPromise)
        .then(ret => success(null, ret));

    connection.end()
};

// 查询机构推荐数据
const queryOrgRecommend = async success => {
    const connection = createConnection();
    connection.connect();

    try {
        let recommendCompData = await queryAsync(sqlQueryOrgRecommend);
        success(recommendCompData)
    } catch (e) {
        console.log(`organizationDao.js:queryOrgRecommend --- ${e}`);
    }
    connection.end()
};

// 区间获取数据
const queryOrgByLimitSimple = async (offset, limit, success) => {
    const connection = createConnection();
    connection.connect();

    let result;
    try {
        result = await queryAsync(sqlQueryOrgByLimit, [offset, limit]);
        let retPromise = dealData(result);

        Promise.all(retPromise)
            .then(ret => success(null, ret));
    } catch (e) {
        console.log(`organizationDao.js:queryOrgByLimitSimple--- ${e}`);
    }
    connection.end();

};

// 根据名字查询数据
const queryOrgByName = async (name, success) => {
    const connection = createConnection();
    connection.connect();
    try {
        let result = await queryAsync(sqlQueryOrgByName, [name]);
        let retPromise = dealData(result);

        Promise.all(retPromise)
            .then(ret => success(null, ret));
    } catch (e) {
        console.log(`organizationDao.js:queryOrgByName --- ${e}`);
    }

    connection.end();
};

// 机构的搜索
const queryOrgSearch = async (page = 1, limit = 5, value, success) => {
    const connection = createConnection();
    connection.connect();

    let offset = (page - 1) * limit;

    value = `%${value}%`;

    try {
        let compData = await queryAsync(sqlQueryOrgSearch, [value, offset, limit]);
        let compCount = await queryAsync(sqlQueryOrgSearchCount, value);

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
        console.log(`organizationDao.js:queryOrgSearch --- ${e}`);
    }
    connection.end()
};

// 获取机构的事件
const queryOrgEventById = async (id, success) => {
    const connection = createConnection();
    connection.connect();

    try {
        let result = await queryAsync(sqlQueryOrgEventById, [id]);
        success(null, result);
    } catch (e) {
        console.log(`organizationDao.js:queryOrgEventById--- ${e}`);
    }
    connection.end()
};

// 获取不是类似: 小米 1的公司数据
const queryOrgNotNormal = async (success) => {
    const connection = createConnection();
    connection.connect();

    let query = '小米 %';
    try {
        let result = queryAsync(sqlQueryOrgNotNormal, [query]);
        success(null, result);
    } catch (e) {
        console.log(`organizationDao.js:queryOrgNotNormal--- ${e}`);
    }

    connection.end();
};

// 根据机构ID获取事件
let count = 0;
let isCloseConnect = true;
let connectionId;
const queryCompanyByID500 = async (id, sum, success) => {
    if (isCloseConnect) {
        isCloseConnect = false;
        connectionId = createConnection();
        connectionId.connect();
    }

    try {
        let result = await queryAsync(sqlQueryOrgEventById, [id]);
        success(null, result);
        console.log(count);
        if (++count >= sum) {
            count = 0;
            console.log('id done');
            connectionId.end();
            isCloseConnect = true;
        }
    } catch (e) {
        console.log(`organizationDao.js:queryCompanyByID500--- ${e}`);
    }
};

module.exports = {
    'queryOrgRecommend' : queryOrgRecommend,
    'queryOrgAll' : queryOrgAll,
    'queryOrgByLimit' : queryOrgByLimit,
    'queryOrgCount' : queryOrgCount,
    'queryAllOrgType' : queryAllOrgType,
    'queryAllOrgTimeStamp' : queryAllOrgTimeStamp,
    'queryAllOrgInvestTag' : queryAllOrgInvestTag,
    'queryAllOrgInvestRound' : queryAllOrgInvestRound,
    'queryOrgBySection' : queryOrgBySection,
    'queryOrgCountBySection' : queryOrgCountBySection,
    'queryOrgByLimitSimple' : queryOrgByLimitSimple,
    'queryOrgByName' : queryOrgByName,
    'queryOrgSearch' : queryOrgSearch,
    'queryOrgEventByBelong' : queryOrgEventByBelong,
    'queryOrgByInvestEvent' : queryOrgByInvestEvent,
    'queryOrgEventById' : queryOrgEventById,
    'queryOrgNotNormal' : queryOrgNotNormal,
    'queryCompanyByID500' : queryCompanyByID500
};



