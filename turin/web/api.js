const req = require("request");
const path = new Map();

function chat (request, response, text) {
    let data = {
        "reqType":0,
        "perception": {
            "inputText": {
                "text": text
            }
        },
        "userInfo": {
            "apiKey": "e6b92f5b72094f418be1cd8a53323267",
            "userId": "123456"
        }
    };

    req({
        url : "http://openapi.tuling123.com/openapi/api/v2",
        method : "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify(data)
    }, function (error, resp, body) {
        if (error && resp.statusCode !== 200) {
            return;
        }

        const res = JSON.parse(body);
        const check = [res, res.results, res.results.length > 0, res.results[0], res.results[0].values];

        if (check.every(item => item !== false)) {
            response.writeHead(200);
            response.write(res.results[0].values.text);
            response.end();
        }
    })
}

path.set("chat", chat);

module.exports.path = path;