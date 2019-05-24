const fs = require('fs');

const config = {};
const confs = fs.readFileSync('./server.config.conf', 'utf8').split('\r\n');
//获取所有配置的数据并转换成对象
confs.forEach( conf => {
    const temp = conf.split('=');
    // { port : 12306, ... }
    config[temp[0]] = temp[1]
});
//如果有静态配置,转换成数组 => { static_request_type : [...] }
if ( config['static_request_type'] ) {
    config['static_request_type'] = config['static_request_type'].split('|')
}

module.exports = config;