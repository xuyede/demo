/* 
    <div id="slide-show"></div>

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
        direction : 'left'              // 轮播方向 : left / right
    });       
*/



(function ($) {
    function SlideShow(options) {
        this.bar = options;
        this.image = [];
        this.url = [];
        this.init();
    }
    SlideShow.prototype.init = function () {
        //添加猫腻图
        this.createFake();
        //创建Dom元素
        this.createDom();
        //获取操作Dom节点
        this.oUlPic = $('.pic-box', $(this.bar.body));
        this.aLiPic = $('.pic-box li', $(this.bar.body));
        this.oBtnl = $('.btn-left', $(this.bar.body));
        this.oBtnr = $('.btn-right', $(this.bar.body));
        this.aLiSml = $('.sml-pic li', $(this.bar.body));
        //获取图片位置数组
        this.PicPosArr = this.getPos($.makeArray(this.aLiPic));
        //轮播索引, 默认第一张
        this.i = 1;
        //定时器
        this.timer = null; 
        //轮播图片长度
        this.len = this.aLiPic.length;
        //设置轮播图第一张图位置
        this.oUlPic.css('left', -this.PicPosArr[1]);
        //启动定时器
        this.startTimer();
        //绑定事件
        this.bindEvent();
    };
    // 
    SlideShow.prototype.createFake = function () {
        // 轮播图格式  : 3 1 2 3 1
        var image = this.bar.image,
            url = this.bar.url,
            imgLen = image.length;

        this.url.push(url[imgLen - 1]);
        this.image.push(image[imgLen - 1]);

        for (var i = 0 ; i < imgLen; i ++) {
            this.image.push(image[i]);
            this.url.push(url[i])
        }
        this.image.push(image[0]);
        this.url.push(url[0]);
    }
    SlideShow.prototype.createDom = function () {
        var picBox = $('<ul class="pic-box"></ul>'),
            smlPic = $('<ul class="sml-pic"><ul>'),
            btnR = $('<span class="btn btn-right"></span>'),
            btnL = $('<span class="btn btn-left"></span>'),
            picStr = '',
            smlStr = '',
            image = this.image,
            url = this.url,
            len = image.length;

        for (var i = 0; i < len; i++) {
            picStr += '<li><a href="'+ url[i] +'"><img src="' + image[i] + '" alt=""></a></li>';
            if (i < len - 2) {
                //小点样式  normal / progress
                this.bar.type === 'normal'
                ? smlStr += '<li></li>'
                : smlStr += '<li><span class="fake"></span></li>';
            }
        }
        
        $(this.bar.body)
            .css({
                'height': this.bar.height + 'px',
                'width' : this.bar.width + 'px'
            })
            .append(picBox.css('width', len * this.bar.width + 'px').html(picStr))
            .append(btnR)
            .append(btnL)
            .append(smlPic.html(smlStr));

        picBox.find('li').css('width', this.bar.width + 'px');
        //设置小点默认样式
        this.bar.type === 'normal'
        ? $('.sml-pic li').eq(0).addClass('active')
        : $('.fake').eq(0).addClass('fill')
    };
    //绑定事件
    SlideShow.prototype.bindEvent = function () {
        var self = this;
        this.oBtnl && this.oBtnl.on('click', function () {
            self.i--;
            self.restart();
        });
        this.oBtnr && this.oBtnr.on('click', function () {
            self.i++;
            self.restart();
        });
        this.aLiSml.on('click', function () {
            self.i = $(this).index() + 1;
            self.restart();
        });
    };
    SlideShow.prototype.restart = function () {
        clearInterval(this.timer);
        this.change();
        this.startTimer();
    };
    //定时器
    SlideShow.prototype.startTimer = function () {
        var self = this;
        var intervalTime = this.bar.interval || 4000;
        var direction = this.bar.direction || 'right'
        this.timer = setInterval(function () {
            //判断轮播图轮播方向
            direction === 'right'
            ? self.i++
            : self.i--

            self.change();
        }, intervalTime);
    };
    //图片运动
    SlideShow.prototype.change = function () {
        // 3 1 2 3 1
        var self = this;
        var animateTime = this.bar.animateDuration || 400
        //右轮播, 当索引大于最后一张时, 瞬间移到第二张, 并把索引改为第三张
        if (this.i > this.len - 1) {
            this.oUlPic.css('left', -this.PicPosArr[1]);
            this.i = 2;
        }
        //左轮播, 当索引小于0时, 瞬间移到倒数第二张, 并把索引改为倒数第三张
        if (this.i < 0) {
            this.oUlPic.css('left', -this.PicPosArr[this.len - 2]);
            this.i = this.len - 3;
        }
        this.showSml();
        this.oUlPic
            .stop()
            .animate({
                'left': -self.PicPosArr[self.i]
            }, animateTime, 'linear');
    };
    //小点样式
    SlideShow.prototype.showSml = function () {
        /* 
            结构 : 3     1 2 3 1
            索引 : 0     1 2 3 4
            小点 : -1(2) 0 1 2 0
        */
        console.log(this.i)
        var index = (this.i - 1) % (this.len - 2);
       
        this.bar.type === 'normal' 
        ? ($('.active', $('#slide-show .sml-pic')).removeClass('active'),
            this.aLiSml.eq(index).addClass('active'))
        : ($('span', $('#slide-show .sml-pic')).removeClass('fill'),
            this.aLiSml.eq(index).children('span').addClass('fill'))
    };
    //获取图片位置
    SlideShow.prototype.getPos = function (arr) {
        var arrPos = [],
            _arr = arr;
        for (var i = 0, len = arr.length; i < len; i++) {
            arrPos.push(_arr[i].offsetLeft);
        }
        return arrPos;
    };

    $.fn.extend({
        sliderImg: function (options) {
            var _options = options;
            _options.body = this || $('body');
            new SlideShow(_options);
        }
    });
}(jQuery));
