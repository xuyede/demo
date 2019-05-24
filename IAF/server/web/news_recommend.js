const { serviceQueryRecommendNewsLimit } = require('../service/newsService.js');
const path = new Map();
const moment = require('moment');

const news_recommend = (request, response, params) => {
    // typeof params['limit'] === 'string'
    // service 请求6条数据
    serviceQueryRecommendNewsLimit( +params['limit'], resp => {

        resp
            .sort( (a, b) => b["create_time"] - a['create_time'])
            .forEach( e => e['create_time'] = moment.unix(e['create_time']).format('YYYY-MM-DD'));

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
//统一接口放到 path中, 便于检测
path.set('news_recommend', news_recommend);
module.exports.path = path;
