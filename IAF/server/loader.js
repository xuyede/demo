const fs = require('fs');
const config = require('./config');

const webPath = new Map();
//获取web文件夹下的所有接口文件 (.js)
const files = fs.readdirSync(`./${config.web_path}`);

//遍历全部接口文件(.js), 获取全部接口
files.forEach( file => {
    //获取文件的内容
    const temp = require(`./${config.web_path}/${file}`);
    //判断是否有 path (所有接口放到 path 属性上)
    if (temp.path) {
        for (const [k, v] of temp.path) {
            //检测接口是否重复
            if (webPath.get(k) == null) {
                webPath.set(k, v);
            } else {
                throw new Error(`接口错误,出现重复接口 ${k}`);
            }
        }
    }
});

module.exports = webPath;
