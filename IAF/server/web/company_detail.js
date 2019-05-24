const path = new Map();
const moment = require('moment');
const { serviceQueryCompanyByID1, serviceQueryCompanyByID } = require('../service/companyService');

const company_detail = (request, response, params) => {
    const { com_id } = params;

    serviceQueryCompanyByID1(com_id, (err, data) => {
        if (data[0].com_id <= 10) {
            let tempArr = data[0]['invest_event'];
            tempArr.forEach(e => e['create_time'] !== '-' && (e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD')));
            data[0]['invest_event'] = tempArr;

            let result = {
                code : 200,
                info : 'success',
                data : data[0]
            };

            response.writeHead(200);
            response.write(JSON.stringify(result));
            response.end()
        } else {
            let id = data[0].com_id;
            serviceQueryCompanyByID(id, (err, data1) => {
                let events = data1.map(d => {
                    const { round, create_time, stock, investor, invest_money } = d;
                    return {
                        round, create_time, stock, investor, invest_money, news_link : '-'
                    }
                });
                data[0].invest_event = events;

                let result = {
                    code : 200,
                    info : 'success',
                    data : data[0]
                };

                response.writeHead(200);
                response.write(JSON.stringify(result));
                response.end()
            })
        }

    })
};

path.set('company_detail', company_detail);
module.exports.path = path;