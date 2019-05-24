const req = require('request');
const { searchData } = require('../util/searchData.js');
const { flatten } = require('../util/flatten.js');
const path = new Map();
const moment = require('moment');

// 获取今年的投资事件数量
const orgInvestThisYear = dataArray => {
    dataArray.forEach(data => {
        let tempArr = data['invest_event'];
        tempArr && tempArr.forEach(e => (e['create_time'] !== '-' || e['create_time'] != null) ? (e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD')) : '');
        data['invest_event'] = tempArr ? tempArr : '';

        let investThisYear = 0;
        Array.isArray(data['invest_event']) ? data['invest_event'].forEach(event => {
            let investYear = event['create_time'].slice(0, 4),
                nowYear = new Date(Math.floor(Date.now())).getFullYear();

            if (+investYear === +nowYear) {
                investThisYear++
            }
        }) : '';
        data['invest_ThisYear'] = investThisYear
    });

    return dataArray
};
// 获取最近的投资
const orgLatelyInvest = dataArray => {
    dataArray.forEach(data => {
        let len = data['invest_event'] && data['invest_event'].length || 0,
            latelyInvest = data['invest_event'] && data['invest_event'].slice(len - 1, len),
            investee = Array.isArray(latelyInvest) && latelyInvest[0]['investee'] || '-',
            sum = Array.isArray(latelyInvest) && latelyInvest[0]['sum'] || latelyInvest[0]['invest_money'] || '-',
            round = Array.isArray(latelyInvest) && latelyInvest[0]['round'] || '-';

        data['latelyInvest'] = `${investee} ${sum} ${round}`;
    });

    return dataArray;
};

const { promisifyAll } = require('bluebird');
const { handleOrgPost } = require('../util/handleOrgPost.js');

const serviceOrg = promisifyAll(require('../service/organizationService.js'));
// serviceQueryOrgAllAsync
// serviceQueryOrgByLimitAsync
// serviceQueryOrgCountAsync
// serviceQueryAllOrgTypeAsync
// serviceQueryAllOrgTimeStampAsync
// serviceQueryAllOrgInvestTagAsync
// serviceQueryAllOrgInvestRoundAsync
// serviceQueryOrgBySectionAsync
// serviceQueryOrgCountBySectionAsync
// serviceQueryOrgByInvestEventAsync
// serviceQueryOrgEventByIdAsync

const dealOrgEvent = org => {
    const reg = /^小米 [0-9][0-5]?$/;
    return  org.map( async o => {
        if (!reg.test(o.org_name)) {
            let events = await serviceOrg['serviceQueryOrgEventByIdAsync'](o.org_id);
            o.invest_event = events;
            o.invest_count = events.length;
            return o
        } else {
            return o
        }
    });
};

const dealOrg = async page => {
    let limit = 20;
    // 第一次请求时获取机构数据, 机构总数, 公司type, time, 机构投资的tag, 机构投资的round
    if (page === 1) {
        let [
            org,
            totalOrg,
            orgType,
            orgTime,
            orgInvestTag,
            orgInvestRound
        ] = await Promise.all([
            serviceOrg['serviceQueryOrgByLimitAsync'](page, limit),
            serviceOrg['serviceQueryOrgCountAsync'](),
            serviceOrg['serviceQueryAllOrgTypeAsync'](),
            serviceOrg['serviceQueryAllOrgTimeStampAsync'](),
            serviceOrg['serviceQueryAllOrgInvestTagAsync'](),
            serviceOrg['serviceQueryAllOrgInvestRoundAsync'](),
        ]);

        org = await Promise.all(dealOrgEvent(org));
        org = orgInvestThisYear(org);
        org = orgLatelyInvest(org);

        return {
            org,
            totalOrg,
            orgType,
            orgTime,
            orgInvestTag,
            orgInvestRound
        };
    }

    // 非第一次获取机构数据即可
    let org = await serviceOrg['serviceQueryOrgByLimitAsync'](page, limit);

    org = await Promise.all(dealOrgEvent(org));
    org = orgInvestThisYear(org);
    org = orgLatelyInvest(org);

    return { org }
};

const handleGetRequest = async (page, params) => {
    let result = null;
    // 是否获取全部
    if (!params['all']) {
        result = await dealOrg(+page)
    } else {
        result = await serviceOrg['serviceQueryOrgAllAsync']()
    }

    return result
};

const _organization = async (request, response, params) => {
    let result = null;
    //分别处理GET / POST请求
    if (params['method'] === 'GET') {
        console.log(`org-GET-page : ${params['page'] || 1}`);
        result = await handleGetRequest(+params['page'], params)
    } else {
        console.log(`org-POST-page : ${params['page'] || 1}`);
        result = await handleOrgPost(
            'organization',
            params.page,
            params.chooseParam,
            serviceOrg['serviceQueryOrgByLimitAsync'],
            serviceOrg['serviceQueryOrgCountAsync'],
            serviceOrg['serviceQueryOrgBySectionAsync'],
            serviceOrg['serviceQueryOrgCountBySectionAsync'],
        );

        result['result'] = orgInvestThisYear(result['result']);
        result['result'] = orgLatelyInvest(result['result']);
    }

    let returnData = {
        code : 200,
        info : 'success',
        data : result
    };

    response.writeHead(200);
    response.write(JSON.stringify(returnData));
    response.end()
};

path.set('organization', _organization);
module.exports.path = path;