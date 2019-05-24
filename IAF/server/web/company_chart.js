const path = new Map();
const { promisifyAll } = require('bluebird');
const serviceCompany = promisifyAll(require('../service/companyService.js'));

const dealData = (tagArray, round) => {
    let retPromise = tagArray.map( async tag => await serviceCompany['serviceQueryCompanyChartAsync'](round, tag));
    return Promise.all(retPromise)
};

const _dealCompanyChart = async () => {
    let tagArray = await serviceCompany['serviceQueryAllCompanyTagAsync'](),
        roundArray = await serviceCompany['serviceQueryAllCompanyRoundAsync'](),
        result = [];
    tagArray = tagArray.slice(1);
    roundArray = roundArray.slice(1);

    await roundArray.reduce( async (baton, round) => {
        let data = await dealData(tagArray, round);
        result.push({
            name : round,
            type : 'bar',
            barWidth : '25',
            stack : 'xyd',
            data : data
        });
        return baton
    }, []);

    return {
        code : 200,
        info : 'success',
        data : {
            tagArray,
            roundArray,
            result
        }
    }
};

const _company_chart = async (request, response) => {
    let result = [];
    try {
        result = await _dealCompanyChart();
    } finally {
        response.write(JSON.stringify(result));
        response.end()
    }
};

path.set('company_chart', _company_chart);

module.exports.path = path;