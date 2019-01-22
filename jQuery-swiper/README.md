html结构

    <div id="slide-show"></div>

js使用

    $('#slide-show').sliderImg({
        image: [                        // 填图片地址
            'https://i1.mifile.cn/a4/xmad_15477232153624_PJpWn.jpg',
            'https://i1.mifile.cn/a4/xmad_15476455699512_MQwfF.jpg',
            'https://i1.mifile.cn/a4/xmad_15476374946177_ZTGJq.jpg'
        ], 
        url: [                          // 图片对应地址
            'https://www.baidu.com',
            'https://www.taobao.com',
            'https://www.mi.com/'
        ],
        width : $(document).width(),    // 轮播图的宽度
        height : 432,                   // 轮播图的高度
        animateDuration : 300,          // 单个切换时间
        interval : 5000,                // 轮播时间
        type : 'progress',              // 小点切换方式 : normal / progress
        direction : 'left',             // 轮播方向 : left / right, 默认right
        autoplay : true,                // 是否自动轮播,默认false, false时, 小点样式只能为 normal
    });       
