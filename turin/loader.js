const fs = require("fs");
const config = require("./config");

const allPath = new Map();
const dir = fs.readdirSync(`./${config["web_path"]}`);

dir.forEach( item => {
   const temp = require(`./${config["web_path"]}/${item}`);
   if (temp.path) {
       for (let [k, v] of temp.path) {
           if (allPath.get(k) == null) {
               allPath.set(k, v);
           } else {
               throw new Error(`interface of ${k} is already define`);
           }
       }
   }
});

module.exports = allPath;