const http = require('http');
const url = require('url');
const fs = require('fs');
const config = require('./config');
const loader = require('./loader');

//判断请求是否为静态请求
const isStaticRequest = function isStaticRequest (target) {
    const staticReq = config.static_request_type;
    let flag = false;
    staticReq.forEach( req => {
        if (target.endsWith(req) || target === '/')
            flag = true;
    });
    return flag
};

//处理请求POST / GET
const dealRequest = (pathname, request, response, params) => {
    if (isStaticRequest(pathname)) {
        console.log(`静态请求: ${pathname}`);
        try {
            let renderFile = null;
            // 默认跳转到主页面
            if (pathname === '/') {
                renderFile = fs.readFileSync(`./${config['page_path']}/index.html`);
            } else {
                renderFile = fs.readFileSync(`./${config['page_path']}${pathname}`);
            }
            response.writeHead(200);
            response.write(renderFile);
            response.end();
        } catch (e) {
            response.writeHead(404);
            response.write('<div><h1>404 NotFound</h1></div>');
            response.end();
        }
    } else {
        console.log(`动态请求: ${pathname}`);
        //获取请求名称
        const targetReq = pathname.replace(/^\//g, '').replace(/\//g, '_'),
            //获取实际的接口函数
            _interface = loader.get(targetReq);

        if (_interface) {
            try {
                _interface(request, response, params);
            } catch (e) {
                response.writeHead(500);
                response.write('<div><h1>500 BadServer</h1></div>');
                response.end();
            }
        } else {
            response.writeHead(404);
            response.write('<div><h1>404 NotFound</h1></div>');
            response.end();
        }
    }
};

let server = http.createServer( (request, response) => {
    //请求接口名字
    const pathname = url.parse(request.url).pathname;
    //GET请求参数
    let params = url.parse(request.url, true).query;
    Object.assign(params, { method : 'GET' });

    // 如果请求是post请求, 则重置params
    if (request.method === 'POST') {
        let body = '';

        request.on('data', chunk => body += chunk);
        request.on('end', () => {
            params = JSON.parse(body);
            Object.assign(params, { method : 'POST' });

            dealRequest(pathname, request, response, params)
        })
    } else {
        dealRequest(pathname, request, response, params)
    }
});

server.listen(config['port'], () => console.log(`服务器启动, 监听${config['port']}端口`));




