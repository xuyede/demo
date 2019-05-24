const { promisifyAll } = require('bluebird');
const moment = require('moment');
// 处理POST请求
const { handlePostRequest } = require('../util/handlePostRequest.js');

const serviceNews = promisifyAll(require('../service/newsService.js'));
//     serviceQueryNewsByLimitAsync,
//     serviceQueryNewsCountAsync,
//     serviceQueryAllNewsTimeStampAsync,
//     serviceQueryAllNewsTagAsync,
//     serviceQueryNewsBySectionAsync
//     serviceQueryNewsCountBySectionAsync

const path = new Map();

// GET请求处理
const handleGetRequest = async (page = 1) => {
    let limit = 20;

    // 第一次请求时获取新闻数据, 新闻总数, 新闻tag / type
    if (page === 1) {
        let [news, totalNews, newsTime, newsType] = await Promise.all([
            serviceNews['serviceQueryNewsByLimitAsync'](page, limit),
            serviceNews['serviceQueryNewsCountAsync'](),
            serviceNews['serviceQueryAllNewsTimeStampAsync'](),
            serviceNews['serviceQueryAllNewsTagAsync']()
        ]);
        news
            .sort( (a, b) => b["create_time"] - a['create_time'])
            .forEach( e => e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD'));

        return {
            totalNews,
            news,
            newsType,
            newsTime
        };
    }

    // 非第一次只获取新闻数据
    let news = await serviceNews['serviceQueryNewsByLimitAsync'](page, limit);

    news
        .sort( (a, b) => b["create_time"] - a['create_time'])
        .forEach( e => e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD'));

    return { news }

};

const news = async (request, response, params) => {
    let result = null;
    // 分别处理GET / POST请求
    if (params['method'] === 'GET') {
        console.log(`news-GET-page : ${params['page']}`);
        result = await handleGetRequest(+params['page'])
    } else {
        console.log(`news-POST-page : ${params['page']}`);
        // serviceQueryNewsByLimitAsync serviceQueryNewsCountAsync serviceNews
        result = await handlePostRequest(
            'news',
            params.page,
            params.chooseParam,
            serviceNews['serviceQueryNewsByLimitAsync'],
            serviceNews['serviceQueryNewsCountAsync'],
            serviceNews['serviceQueryNewsBySectionAsync'],
            serviceNews['serviceQueryNewsCountBySectionAsync']
        );
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

//统一接口放到 path中
path.set('news', news);
module.exports.path = path;