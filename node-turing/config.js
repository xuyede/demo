const fs = require("fs");

let config = {};
const conf = fs.readFileSync("./serverConfig.conf").toString().split("\r\n");

conf.forEach( item => {
   let temp = item.split("=");
   config[temp[0]] = temp[1];
});

if (config["static_req"]) {
    config["static_req"] = config["static_req"].split("|");
} else {
    throw new Error('serverConfig.conf do not has the prop of static_req');
}

module.exports = config;
