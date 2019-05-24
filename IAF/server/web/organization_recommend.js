const path = new Map();
const { serviceQueryOrgRecommend } = require('../service/organizationService');
const moment = require('moment');

const organization_recommend = (request, response) => {
    serviceQueryOrgRecommend( resp => {
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

path.set("organization_recommend", organization_recommend);
module.exports.path = path;