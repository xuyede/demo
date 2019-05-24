const trimNews = (array, prop) => {
    array.forEach(ele => {
        // '2018-05-19 13:35' => ['2018-05-19']
        // 找出在空格前的字符串
        ele[prop] = ele[prop].match(/[\s\S]+(?=(\s))/g)[0]
    })
    return array
}

module.exports.trimNews = trimNews;