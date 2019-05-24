const year2timeStamp = require('./year2TimeStamp.js');
const moment = require('moment');

/**
 * @method handlePostRequest
 * @param table 查询表名称
 * @param page 页数
 * @param chooseParam 筛选数据
 * @param noChooseData 没有筛选条件的获取值的函数
 * @param noChooseCount 没有筛选条件的获取数量的函数
 * @param chooseData 根据筛选条件的获取值的函数
 * @param chooseCount 根据筛选条件的获取数量的函数
 * @returns Object
 */
const handlePostRequest = async (table, page = 1, chooseParam, noChooseData, noChooseCount, chooseData, chooseCount) => {
    let limit = 20;
    let noChoose = chooseParam.every( choose => choose.data.length === 0);

    // 啥都没选择, 直接放回20条数据
    if (noChoose) {

        let [result, totalLength] = await Promise.all([
            noChooseData(page, limit),
            noChooseCount()]
        );

        if ( table === 'news' )
            result
                .sort( (a, b) => b["create_time"] - a['create_time'])
                .forEach( e => e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD'));

        return {
            totalLength,
            result
        };
    } else {
        let hasCreateTime = false,          // 是否有create_time属性
            createTimeIndex = undefined,    // 有create_time属性,在chooseParam的索引
            createTimeIndexNo = undefined;  // 没有create_time属性,在chooseParam的索引

        // 检测create_time属性是否有值,如果有,找出在chooseParam的位置
        chooseParam.forEach( ( choose, index) => {
            if (choose['flag'] === 'create_time') {
                createTimeIndexNo = index;
                if (choose['data'].length > 0) {
                    hasCreateTime = true;
                    createTimeIndex = index;
                }
            }
        });

        // 判断是否有create_time选择项
        if (hasCreateTime) {
            // 获取create_time的数据
            const timeStamp = chooseParam.splice(createTimeIndex, 1)[0].data;
            // 把年份转换成对应的时间戳
            const createTimeData = timeStamp.map( data => {
                const {head, tail} = year2timeStamp[data];
                return { head, tail}
            });
            // sql查询参数列表
            const paramsList = [];

            //sql查询语句拼接
            let sqlQueryNewsByTimeStampSection = 'select * from '+ table +' where (';
            // 拼接create_time属性 create_time between ? and ? or
            createTimeData.forEach( timeStamp => {
                const { head, tail } = timeStamp;
                paramsList.push(head, tail);
                sqlQueryNewsByTimeStampSection += 'create_time between ? and ? or '
            });
            sqlQueryNewsByTimeStampSection = sqlQueryNewsByTimeStampSection.replace(/\sor\s$/g, ')');
            // 拼接其他的属性 and props = ?
            chooseParam.forEach( choose => {
                if (choose.data.length > 0) {
                    sqlQueryNewsByTimeStampSection += ' and (';
                    choose.data.forEach( target => {
                        sqlQueryNewsByTimeStampSection += `${choose['flag']} = ? or `;
                        paramsList.push(target);
                    });
                    sqlQueryNewsByTimeStampSection = sqlQueryNewsByTimeStampSection.replace(/\sor\s$/g, ')');
                }
            });

            // 获取数据(20条) <-> 获取数据长度(总长度)
            let [result, totalLength] = await Promise.all([
                chooseData(sqlQueryNewsByTimeStampSection, paramsList, page),
                chooseCount(sqlQueryNewsByTimeStampSection, paramsList)
            ]);

            if (table === 'news')
                result
                    .sort( (a, b) => b["create_time"] - a['create_time'])
                    .forEach( e => e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD'));

            return {
                totalLength,
                result
            };
        } else {
            // 没有选择时间属性,把create_time选择去除
            chooseParam.splice(createTimeIndexNo, 1);
            // sql查询参数
            const paramsList = [];
            // sql查询语句拼接
            let sqlQueryNewsByTimeStampSection = 'select * from '+ table +' where (';
            chooseParam.forEach( choose => {
                if (choose.data.length > 0) {
                    sqlQueryNewsByTimeStampSection += ' and (';
                    choose.data.forEach( target => {
                        sqlQueryNewsByTimeStampSection += `${choose['flag']} = ? or `;
                        paramsList.push(target);
                    });
                    sqlQueryNewsByTimeStampSection = sqlQueryNewsByTimeStampSection.replace(/\sor\s$/g, ')');
                }
            });
            sqlQueryNewsByTimeStampSection = sqlQueryNewsByTimeStampSection.replace(/\(\sand\s(?=\()/g, '');
            // 获取数据(20条) <-> 获取数据长度(总长度)
            let [result, totalLength] = await Promise.all([
                chooseData(sqlQueryNewsByTimeStampSection, paramsList, page),
                chooseCount(sqlQueryNewsByTimeStampSection, paramsList)
            ]);

            if (table === 'news')
                result
                    .sort( (a, b) => b["create_time"] - a['create_time'])
                    .forEach( e => e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD'));

            return {
                totalLength,
                result
            };
        }
    }
};
module.exports.handlePostRequest = handlePostRequest;