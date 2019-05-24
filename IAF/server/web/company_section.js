const path = new Map();
const { promisify } = require('util');
const { serviceQueryCompanyByLimitSimple, serviceQueryCompanyByID500 } = require('../service/companyService');
const serviceQueryCompanyByID500Async = promisify(serviceQueryCompanyByID500);

const dealCompanyEvent = company => {
    return company.map( async c => {
        if (c.com_id > 10) {
            let events = await serviceQueryCompanyByID500Async(c.com_id);
            c.invest_event = events;
            return c
        } else {
            return c
        }
    })
};

const company_section = (request, response, params) => {
    const { head, tail} = params;
    const limit = tail - head;

    serviceQueryCompanyByLimitSimple(+head, +limit, async (err, data) => {
        let ret = await data;

        ret = await Promise.all(dealCompanyEvent(ret));

        let result = {
            code : 200,
            info : 'success',
            data : ret
        };

        response.writeHead(200);
        response.write(JSON.stringify(result));
        response.end()
    })
};

path.set('company_section', company_section);

module.exports.path = path;