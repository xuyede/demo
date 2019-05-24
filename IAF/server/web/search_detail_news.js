const path = new Map();
const { promisify } = require('util');
const { serviceQueryNewsSearch } = require('../service/newsService');
const serviceQueryNewsSearchAsync = promisify(serviceQueryNewsSearch);

const reqNews = async (params) => {
    // 请求数据库的news  serviceQueryNewsSearchAsync (page, limit, value)
    const { page, value, limit } = params;
    return await serviceQueryNewsSearchAsync(page, limit, value);
};

const search_detail_news = async (request, response, params) => {
    params.limit = 20;
    // params -> page value limit
    const newsResult = await reqNews(params);

    const result = {
        code : 200,
        info : 'success',
        data : {
            newsResult
        }
    };

    response.writeHead(200);
    response.write(JSON.stringify(result));
    response.end();
};

//统一接口放到 path中, 便于检测
path.set('search_detail_news', search_detail_news);
module.exports.path = path;





