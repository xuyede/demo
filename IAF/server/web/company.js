const path = new Map();
const { promisifyAll } = require('bluebird');
const { handlePostRequest } = require('../util/handlePostRequest.js');

const serviceCompany = promisifyAll(require('../service/companyService.js'));
// serviceQueryCompanyAllAsync
// serviceQueryCompanyCountAsync
// serviceQueryAllCompanyTimeStampAsync
// serviceQueryAllCompanyTagAsync
// serviceQueryAllCompanyRoundAsync
// serviceQueryAllCompanyStateAsync
// serviceQueryCompanyBySectionAsync
// serviceQueryCompanyCountBySectionAsync
// serviceQueryCompanyByIDAsync

const dealCompanyEvent = company => {
    return company.map( async c => {
        if (c.com_id > 10) {
            let events = await serviceCompany['serviceQueryCompanyByIDAsync'](c.com_id);
            c.invest_event = events;
            return c
        } else {
            return c
        }
    })
};

const dealCompany = async page => {
    let limit = 20;
    // 第一次请求时获取公司数据, 公司总数, 公司tag, time, round, state
    if (page === 1) {
        let [
            company,
            totalCompany,
            companyTime,
            companyType,
            companyRound,
            companyState
        ] = await Promise.all([
            serviceCompany['serviceQueryCompanyByLimitAsync'](page, limit),
            serviceCompany['serviceQueryCompanyCountAsync'](),
            serviceCompany['serviceQueryAllCompanyTimeStampAsync'](),
            serviceCompany['serviceQueryAllCompanyTagAsync'](),
            serviceCompany['serviceQueryAllCompanyRoundAsync'](),
            serviceCompany['serviceQueryAllCompanyStateAsync'](),
        ]);

        company = await Promise.all(dealCompanyEvent(company));

        return {
            totalCompany,
            company,
            companyTime,
            companyType,
            companyRound,
            companyState
        };
    }

    // 非第一次著获取新闻数据
    let company = await serviceCompany['serviceQueryCompanyByLimitAsync'](page, limit);
    company = await Promise.all(dealCompanyEvent(company));
    return { company }
};

const handleGetRequest = async (page, params) => {
    let result = null;
    //是否获取全部
    if (!params['all']) {
        result = await dealCompany(+page)
    } else {
        result = await serviceCompany['serviceQueryCompanyAllAsync']()
    }

    return result;
};

const company = async (request, response, params) => {
    let result = null;
    //分别处理GET / POST请求
    if (params['method'] === 'GET') {
        console.log(`company-GET-page : ${params['page'] || 1}`);
        result = await handleGetRequest(+params['page'], params)
    } else {
        console.log(`company-POST-page : ${params['page'] || 1}`);
        result = await handlePostRequest(
            'company',
            params.page,
            params.chooseParam,
            serviceCompany['serviceQueryCompanyByLimitAsync'],
            serviceCompany['serviceQueryCompanyCountAsync'],
            serviceCompany['serviceQueryCompanyBySectionAsync'],
            serviceCompany['serviceQueryCompanyCountBySectionAsync'],
        )
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

path.set('company', company);
module.exports.path = path;