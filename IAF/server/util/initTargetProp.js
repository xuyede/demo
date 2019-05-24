const moment = require('moment');

// 时间戳格式化
const handelTimeStamp = timeArray => {
    // 把表的数据(create_time)转换为 YYYY
    let times = timeArray.map( time => time['create_time'] != undefined && moment.unix(time['create_time']).format('YYYY'));
    return ['不限', ...(Array.from( new Set([...times])).sort( (a, b) => b - a))].filter(e => e);
};
// 类型格式化
const handleTag = tagArray =>
    ['不限', ...Array.from(new Set([ ...tagArray.map( tag => tag['tag'])])).filter(e => e)];// 类型格式化

const handleField = tagArray =>
    ['不限', ...Array.from(new Set([ ...tagArray.map( tag => tag['field'])])).filter(e => e)];

// 轮次格式化
const handleRound = roundArray =>
    ['不限', ...Array.from(new Set([ ...roundArray.map( tag => tag['round'])])).filter(e => e)];

// 状态格式化
const handleState = stateArray =>
    ['不限', ...Array.from(new Set([ ...stateArray.map( tag => tag['state'])])).filter(e => e)];

// 类型格式化
const handleType = typeArray =>
    ['不限', ...Array.from(new Set([ ...typeArray.map( tag => tag['org_type'])])).filter(e => e)];


module.exports = {
    'handelTimeStamp' : handelTimeStamp,
    'handleTag' : handleTag,
    'handleRound' : handleRound,
    'handleState' : handleState,
    "handleType" : handleType,
    'handleField' : handleField
}