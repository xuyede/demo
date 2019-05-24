const path = new Map();
const { promisify } = require('util');
const { serviceQueryCompanySearch } = require('../service/companyService');
const serviceQueryCompanySearchAsync = promisify(serviceQueryCompanySearch);

const reqComp = async (params) => {
    // 请求数据库的news  serviceQueryNewsSearchAsync (page, limit, value)
    const { page, value, limit } = params;
    return await serviceQueryCompanySearchAsync(page, limit, value);
};

const search_detail_comp = async (request, response, params) => {
    params.limit = 20;
    // params -> page value limit
    const compResult = await reqComp(params);

    const result = {
        code : 200,
        info : 'success',
        data : {
            compResult
        }
    };

    response.writeHead(200);
    response.write(JSON.stringify(result));
    response.end();
};

//统一接口放到 path中, 便于检测
path.set('search_detail_comp', search_detail_comp);
module.exports.path = path;





