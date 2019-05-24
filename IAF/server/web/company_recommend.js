const path = new Map();
const moment = require('moment');
const { serviceQueryRecommendCompany } = require('../service/companyService');

const company_recommend = (request, response) => {
    serviceQueryRecommendCompany( resp => {
        resp
            .forEach( e => e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD') );

        let result = {
            code : 200,
            info : 'success',
            data : resp
        };

        response.writeHead(200);
        response.write(JSON.stringify(result));
        response.end()
    })
};

path.set("company_recommend", company_recommend);
module.exports.path = path;