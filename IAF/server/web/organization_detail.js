const path = new Map();
const moment = require('moment');
const { promisify } = require('util');
const { serviceQueryOrgByName, serviceQueryOrgEventById } = require('../service/organizationService');
const serviceQueryOrgEventByIdAsync = promisify(serviceQueryOrgEventById);

const _organization_detail = (request, response, params) => {
    const { org_name } = params;

    serviceQueryOrgByName(org_name, async (err, data) => {
        let org = data[0];

        if (!/^小米 [0-9][0-5]?$/.test(org.org_name)) {
            let events = await serviceQueryOrgEventByIdAsync(org.org_id);
            org.invest_event = events
        }

        let tempArr = org['invest_event'];
        if (Array.isArray(tempArr)) {
            tempArr.forEach(e => e['create_time'] !== '-' && (e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD')));
            data[0]['invest_event'] = tempArr;
        } else {
            data[0]['invest_event'] = undefined
        }

        let result = {
            code : 200,
            info : 'success',
            data : data[0]
        };

        response.writeHead(200);
        response.write(JSON.stringify(result));
        response.end()
    })
};

path.set('organization_detail', _organization_detail);

module.exports.path = path;