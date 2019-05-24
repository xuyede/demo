const path = new Map();
const {
    serviceQueryOrgByInvestEvent,
    serviceQueryOrgNotNormal,
    serviceQueryCompanyByID500
} = require('../service/organizationService');
const { promisify } = require('util');
const serviceQueryOrgByInvestEventAsync = promisify(serviceQueryOrgByInvestEvent);
const serviceQueryOrgNotNormalAsync = promisify(serviceQueryOrgNotNormal);
const serviceQueryCompanyByID500Async = promisify(serviceQueryCompanyByID500);
const moment = require('moment');

// 获取 年 月 金额
const getInvestTime = dataArray =>
    dataArray.reduce( (baton, org) => {
        let investEvent = org['invest_event'];
        return baton.concat(investEvent.map( event => {
            let [year, month] = event['create_time'].slice(0, 7).split('-'),
                sum = event.sum;
            return {
                year, month, sum
            }
        }))
    }, []);

// { YQ : 20181, sum : 12 }
const normalizeInvest = investInfo =>
    investInfo
        .map(info => {
            let {year, month, sum} = info,
                YQ;

            if (month > 0 && month <= 3) {
                YQ = `${year}1`
            } else if (month > 3 && month <= 6) {
                YQ = `${year}2`
            } else if (month > 6 && month <= 9) {
                YQ = `${year}3`
            } else if (month > 9 && month <= 12) {
                YQ = `${year}4`
            }

            sum = +(sum.split('￥')[1]).split('亿')[0];
            // { YQ : 20181, sum : 12 }
            return { YQ, sum }
        })
        .sort( (a, b) => +a['YQ']- +b['YQ']);

const transformInvest = investByNormalize => {
    let obj = new Map();
    investByNormalize.forEach(info => {
        let { YQ, sum } = info;
        if ( !obj.get(YQ) ) {
            obj.set(YQ, sum)
        } else {
            let tempSum = obj.get(YQ);
            tempSum += sum;
            obj.set(YQ, tempSum)
        }
    });

    let XData = [], YData = [];
    for (let [k, v] of obj) {
        // 20171 => 2017-Q1
        k = k.replace(/([0-9])$/, `-Q$1`);
        XData.push(k)
        YData.push(v)
    }

    if (XData.length > 9) {
        XData = XData.slice(XData.length - 9);
        YData = YData.slice(XData.length - 9);
    }

    return { XData, YData }
};

const dealChartData = async () => {
    let dataArray = await serviceQueryOrgByInvestEventAsync();

    dataArray.forEach(e => {
        let tempArr = e['invest_event'];
        tempArr.forEach(e => e['create_time'] !== '-' && (e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD')));
        e['invest_event'] = tempArr;
    });

    let investInfo = getInvestTime(dataArray),
        investByNormalize = normalizeInvest(investInfo),
        { XData, YData } = transformInvest(investByNormalize);

    return { XData, YData};
};

const dealOrgEvent = org => {
    const reg = /^小米 [0-9][0-5]?$/;
    return  org.map( async o => {
        if (!reg.test(o.org_name)) {
            let events = await serviceQueryCompanyByID500Async(o.org_id, org.length);
            o.invest_event = events;
            o.invest_count = events.length;
            return o
        } else {
            return o
        }
    });
};

const dealTopData = async () => {
    let normalArray = await serviceQueryOrgByInvestEventAsync();
    let orgArray = await serviceQueryOrgNotNormalAsync();
    orgArray = await Promise.all(dealOrgEvent(orgArray));

    let dataArray = [...normalArray, ...orgArray];

    dataArray.forEach(e => {
        let tempArr = e['invest_event'];
        tempArr.forEach(e => (e['create_time'] !== '-' || e['create_time'] != null) ? (e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD')) : '');
        e['invest_event'] = tempArr;
    });

    return dataArray
        .map( data => {
            let { org_name, invest_event } = data;
            return {
                name : org_name,
                investCount : invest_event.length
            }
        })
        .sort( (a, b) => b['investCount'] - a['investCount'])
        .slice(0 ,10)

};

const organization_chart = async (request, response) => {
    let chartResult = await dealChartData(),
        topResult = [
            { name: 'IDG资本', investCount: 845 },
            { name: '真格基金', investCount: 733 },
            { name: '经纬中国', investCount: 726 },
            { name: '红杉资本中国', investCount: 707 },
            { name: '深创投', investCount: 522 },
            { name: '腾讯', investCount: 500 },
            { name: '险峰长青', investCount: 419 },
            { name: '创新工场', investCount: 414 },
            { name: '达晨创投', investCount: 334 },
            { name: '君联资本', investCount: 332 }];

    let result = {
        code : 200,
        info : 'success',
        data : {
            opt : chartResult,
            top : topResult
        }
    };

    response.writeHead(200);
    response.write(JSON.stringify(result));
    response.end()
};

path.set('organization_chart', organization_chart);

module.exports.path = path;