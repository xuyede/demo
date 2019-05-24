const path = new Map();
const { promisify } = require('util');
const { serviceQueryNewsSearch } = require('../service/newsService');
const { serviceQueryCompanySearch } = require('../service/companyService');
const { serviceQueryOrgSearch } = require('../service/organizationService');
const serviceQueryNewsSearchAsync = promisify(serviceQueryNewsSearch);
const serviceQueryCompanySearchAsync = promisify(serviceQueryCompanySearch);
const serviceQueryOrgSearchAsync = promisify(serviceQueryOrgSearch);

const reqNews = async (params) => {
    // 请求数据库的news  serviceQueryNewsSearchAsync (page, limit, value)
    const { page, value, limit } = params;
    return await serviceQueryNewsSearchAsync(page, limit, value);
};

const reqOrg = async params => {
    const { page, value, limit } = params;
    return await serviceQueryOrgSearchAsync(page, limit, value);
};

const reqCompany = async params => {
    const { page, value, limit } = params;
    return await serviceQueryCompanySearchAsync(page, limit, value);
};

const search_detail = async (request, response, params) => {
    params.limit = 20;
    // params -> page value limit
    const companyResult = await reqCompany(params);
    const orgResult = await reqOrg(params);
    const newsResult = await reqNews(params);

    const result = {
        code : 200,
        info : 'success',
        data : {
            companyResult,
            orgResult,
            newsResult
        }
    };

    response.writeHead(200);
    response.write(JSON.stringify(result));
    response.end();
};

//统一接口放到 path中, 便于检测
path.set('search_detail', search_detail);
module.exports.path = path;