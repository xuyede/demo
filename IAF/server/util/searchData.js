const searchData = (data, params) => {
    // params数据结构
    // params : {
    //     "chooseParam" : [
    //         {
    //             "flag" : "tag",
    //             "data" : ["汽车交通", "旅游", "金融"]
    //         },
    //         {
    //             "flag" : "round",
    //             "data" : ["尚未获投", "天使轮", "种子轮"]
    //         }
    //     ],
    //     "page" : 1
    // }

        // 获取选择的标签和页数
    let { chooseParam, page, origin } = params;
        if (!page) page = 1;
        //获取全部数据
    let dataArray = JSON.parse(data).data,
        // 20条数据截取的始止点
        start = 20 * (page - 1),
        end = 20 * (page - 1) + 20;

    //  "chooseParam" : [
    //     {
    //         "flag" : "tag",
    //         "data" : ["汽车交通", "旅游", "金融"]
    //     },
    //     {
    //         "flag" : "round",
    //         "data" : []
    //     }
    //  ]
    // 有效的选择标签数, 计算data不为空数量
    let legalChooseLength = 0;
    chooseParam.forEach( choose => {
        if (choose.data.length !== 0) {
            legalChooseLength++
        }
    });

    // 筛选出符合条件的数据
    let resultArray = dataArray.filter( data => {
        chooseParam.forEach( choose => {
            // { flag : ... data : [] }
            if (choose.data.length !== 0) {
                choose.data.forEach( target => {
                    // target -> 交通 / 教育 / 2019 / ...
                    if (!origin) {
                        // 如果符合,则在该条数据加上一个对应的属性,并设置为true/false, 如果是false的话,可以被后面的判断覆盖
                        if (data[`xyd_${choose['flag']}`] === undefined || data[`xyd_${choose['flag']}`] === false) {
                            if (choose['flag'] === 'create_time') {
                                data[`xyd_${choose['flag']}`] = data[choose['flag']].startsWith(target)
                            } else {
                                data[`xyd_${choose['flag']}`] = data[choose['flag']] === target
                            }
                        }
                    } else {
                        // 机构的筛选
                        // 如果符合,则在该条数据加上一个对应的属性,并设置为true/false, 如果是false的话,可以被后面的判断覆盖
                        if (data[`xyd_${choose['flag']}`] === undefined || data[`xyd_${choose['flag']}`] === false) {
                            if (choose['flag'] === 'create_time') {
                                data[`xyd_${choose['flag']}`] = data[choose['flag']].startsWith(target)
                            } else if (choose['flag'] === 'org_type') {
                                data[`xyd_${choose['flag']}`] = data[choose['flag']] === target
                            } else {
                                data[`xyd_${choose['flag']}`] = data['invest_event'].some( event => event[choose['flag']] === target)
                            }
                        }
                    }

                })
            }
        });

        // 计算该条数据是否都符合筛选条件
        let count = 0;
        for (let key in data) {
            if (key.startsWith('xyd_'))
                if (data[key]) {
                    count++;
                    delete data[key]
                }
        }
        return count === legalChooseLength
    });

    let totalLength = resultArray.length,
        result = resultArray.slice(start, end);

    return {
        code : 200,
        info : 'success',
        data : {
            result,
            totalLength
        }
    }
};

module.exports.searchData = searchData