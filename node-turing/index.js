const http = require("http");
const url = require("url");
const fs = require("fs");
const config  = require("./config");
const loader = require("./loader");

// 开启服务器
http.createServer(function (request, response) {
    const pathname = url.parse(request.url).pathname;
    const params = url.parse(request.url, true).query;
    const isStatic = isStaticRequest(pathname);

    // 判断请求类型
    if (isStatic) {
        console.log(`静态请求: ${pathname}`);
        try {
            const randerFile = fs.readFileSync('./' + config["page_path"] + pathname);
            response.writeHead(200);
            response.write(randerFile);
            response.end();
        } catch (e) {
            response.writeHead(404);
            response.write("<html><body><h1>404 NotFound</h1></body></html>");
            response.end();
        }
    } else {
        console.log(`动态请求: ${pathname}`);
        let interface = pathname.split("/"),
            len = interface.length;

        if (loader.get(interface[len - 1])) {
            try {
                loader.get(interface[len - 1])(request, response, params.text);
            } catch (e) {
                response.writeHead(500);
                response.write("<html><body><h1>500 BadServer</h1></body></html>");
                response.end();
            }
        } else {
            response.writeHead(404);
            response.write("<html><body><h1>404 NotFound</h1></body></html>");
            response.end();
        }
    }
}).listen(config["port"]);

function isStaticRequest (target) {
    const staticReq = config["static_req"];
    let is = false;
    staticReq.forEach( item => {
        if (target.endsWith(item)) {
            is = true;
        }
    });
    return is;
}