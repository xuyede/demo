const path = new Map();
const { promisify } = require('util');
const { serviceQueryOrgSearch } = require('../service/organizationService');
const serviceQueryOrgSearchAsync = promisify(serviceQueryOrgSearch);

const reqOrg = async (params) => {
    // 请求数据库的news  serviceQueryNewsSearchAsync (page, limit, value)
    const { page, value, limit } = params;
    return await serviceQueryOrgSearchAsync(page, limit, value);
};

const search_detail_org = async (request, response, params) => {
    params.limit = 20;
    // params -> page value limit
    const orgResult = await reqOrg(params);

    const result = {
        code : 200,
        info : 'success',
        data : {
            orgResult
        }
    };

    response.writeHead(200);
    response.write(JSON.stringify(result));
    response.end();
};

//统一接口放到 path中, 便于检测
path.set('search_detail_org', search_detail_org);
module.exports.path = path;





