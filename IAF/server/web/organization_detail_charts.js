const path = new Map();
const { serviceQueryOrgByName } = require('../service/organizationService');
const { promisify } = require('util');
const serviceQueryOrgByNameAsync = promisify(serviceQueryOrgByName);
const moment = require('moment');

const dealDataByTag = async name => {
    let dataArray = await serviceQueryOrgByNameAsync(name);
    let eventArray = dataArray.filter(e => e['org_name'] === name)[0]['invest_event'] || '';
    let tagArray = (Array.isArray(eventArray) && Array.from(new Set([...eventArray.map(e => e['tag'])]))) || [];
    let tagCountArray = [];
    let tagSumArray = [];

    tagArray.length > 0 && tagArray.forEach( tag => {
        tagCountArray.push( eventArray.filter(event => event['tag'] === tag ).length );
        tagSumArray.push( eventArray.reduce((baton, event) => {
            let sum = +(event['sum'].split('￥')[1]).split('亿')[0];

            if ( event['tag'] === tag ) {
                return baton += sum
            }
            return baton
        }, 0))
    });

    return {
        tagArray, tagCountArray, tagSumArray
    }
};

const dealDataByTime = async name => {
    let dataArray = await serviceQueryOrgByNameAsync(name);
    let eventArray = dataArray.filter(e => e['org_name'] === name)[0]['invest_event'] || '';
    let timeArray = (Array.isArray(eventArray) && Array.from(new Set([...eventArray.map(e => moment.unix(e['create_time']).format('YYYY-MM-DD').slice(0, 4))]))) || [];
    let timeCountArray = [];
    let timeSumArray = [];
    timeArray.length > 0 && timeArray.forEach( time => {
        timeCountArray.push( eventArray.filter(event => moment.unix(event['create_time']).format('YYYY-MM-DD').slice(0, 4) === time ).length );
        timeSumArray.push( eventArray.reduce((baton, event) => {
            let sum = +(event['sum'].split('￥')[1]).split('亿')[0];

            if ( moment.unix(event['create_time']).format('YYYY-MM-DD').slice(0, 4) === time ) {
                return baton += sum
            }
            return baton
        }, 0))
    });

    return {
        timeArray, timeCountArray, timeSumArray
    }
};

const organization_detail_charts = async (request, response, params) => {
    let { org_name } = params;

    let dealByTag = await dealDataByTag(org_name),
        dealByTime = await dealDataByTime(org_name);

    let result = {
        code : 200,
        info : 'success',
        data : {
            tagData : dealByTag,
            timeData : dealByTime
        }
    };

    response.writeHead(200);
    response.write(JSON.stringify(result));
    response.end()
};

path.set('organization_detail_charts', organization_detail_charts);
module.exports.path = path;