const path = new Map();
const { serviceQueryOrgByLimitSimple } = require('../service/organizationService');

const _organization_section = (request, response, params) => {
    const { head, tail} = params;
    const limit = tail - head;

    serviceQueryOrgByLimitSimple(+head, +limit, async (err, data) => {
        let ret = await data;

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

path.set('organization_section', _organization_section);

module.exports.path = path;