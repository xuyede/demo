const path = new Map();
const { promisify } = require('util');
const { serviceQueryCompanySearch } = require('../service/companyService');
const { serviceQueryOrgSearch } = require('../service/organizationService');
const serviceQueryCompanySearchAsync = promisify(serviceQueryCompanySearch);
const serviceQueryOrgSearchAsync = promisify(serviceQueryOrgSearch);

const _reqCompany = async params => {
    const { value } = params;
    let result = await serviceQueryCompanySearchAsync(undefined, undefined, value);
    return result['data'];
};

const _reqOrg = async params => {
    const { value } = params;
    let result = await serviceQueryOrgSearchAsync(undefined, undefined, value);
    return result['data']
};

const _search = async (request, response, params) => {
    const companyResult = await _reqCompany(params);
    const orgResult = await _reqOrg(params);

    const result = {
        code : 200,
        info : 'success',
        data : {
            companyResult,
            orgResult
        }
    };

    response.writeHead(200);
    response.write(JSON.stringify(result));
    response.end();
};

//统一接口放到 path中, 便于检测
path.set('search', _search);
module.exports.path = path;
