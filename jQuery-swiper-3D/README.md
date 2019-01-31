html结构

    <div id="slideshow"></div>

js使用

    $('#slideshow').slide({
        //图片
        image : [       
            './img/1.jpg',
            './img/2.jpg',
            './img/3.jpg',
            './img/5.jpg',
            './img/4.jpg',
        ],
        //图片超链接
        imageUrl : [
            'https://www.baidu.com',
            'https://www.taobao.com',
            'https://mail.163.com',
            'https://ke.qq.com/index.html',
            'https://www.bilibili.com/'
        ],
        //自动轮播
        autoplay : true,
        //轮播方向
        direction : 'right',
        //轮播时间
        interval : 3000,
        //切换时间
        animateTime : 400,
        //总的宽高
        stageWidth : 1200,
        stageHeight : 300,
        //单个轮播内容宽高
        imageHeight : 150,
        imageWidth : 200
    });
