(function ($) {
    function Slide(param) {
        this.body = param.body;
        this.param = param;
        this.timer = null;
        this.len = this.param.image.length;
        this.init();
    }
    
    Slide.prototype = {
        createDom : function () {
            var image = this.defaultOption.image
            this.body
                .css({
                    width : this.defaultOption.stageWidth + 'px',
                    height : this.defaultOption.stageHeight + 'px'
                })

            //生成图片元素
            for (var i = 0; i < this.len; i++) {
                var imgBox = $('<div class="box"></div>'),
                    img = new Image(),
                    imageWidth = this.defaultOption.imageWidth,
                    imageHeight = this.defaultOption.imageHeight;

                img.src = image[i];
                imgBox
                    .css({
                        width : imageWidth + 'px',
                        height : imageHeight + 'px',
                        marginLeft : -imageWidth / 2 + 'px',
                        marginTop : -imageHeight / 2 + 'px',
                        transition : 'all ' + this.defaultOption.animateTime / 1000 + 's'
                    })
                    .addClass('img' + i)
                    .data('url', this.defaultOption.imageUrl[i])
                    .append(img)
                    //提示, 可删掉
                    .append($('<span style="position: absolute;z-index: 99; left: 0">' + this.defaultOption.imageUrl[i] + '</span>'))
                    .appendTo(this.body)
                
                //给中间的加上超链接
                if (i == 2) {
                    this.addImageUrl( $('.img2') )
                }
            }
        },
        init: function () {
            //默认配置
            this.defaultOption = {
                autoplay : false,
                interval : 4000,
                animateTime : 500,
                stageWidth : 1200,
                stageHeight : 300,
                imageHeight : 150,
                imageWidth : 200,
                direction : 'right'
            }
            $.extend(this.defaultOption, this.param)

            //创建元素
            this.createDom();
            //绑定事件
            this.bindEvent();
            //自动轮播
            if (this.param.autoplay) {
                this.autoSlide();
            }
        },
        addImageUrl: function (parent) {
            $('img', parent).wrap($('<a id="url" href="' + $(parent).data('url') + '"></a>'))
        },
        removeImageUrl: function (parent) {
            console.log(111)
            $('img', parent).unwrap()
        },
        bindEvent: function () {
            var self = this;

            this.body.on('click', '.box', function () {
                //点击的图片索引
                var index = Number($(this).attr('class').split('img')[1]);  
                //点击的图片索引与中间的图索引的差值, 正数右移(1, 2), 负数左移(-1, -2)
                var disLen = Math.floor(self.len / 2) - index;    
                //点击中间那张,直接跳转
                if ( index === 2 ) {
                    console.log(111)
                    return
                } 
                //如果点击的不是中间的, 则移除 a标签
                self.removeImageUrl( $('#url') )               
     
                for (var i = 0; i < self.len; i++) {
                    //获取每个轮播内容的 class索引
                    var nowIndex = Number($('.box', $(self.body)).eq(i).attr('class').split('img')[1]);
                    //每个轮播内容新的 class索引
                    var pos = nowIndex + disLen;
                    //判断位置
                    if (pos < 0) {
                        pos = self.len + pos;
                    } else if (pos > self.len - 1) {
                        pos = pos - self.len;
                    }
                    //赋予新的 class类名
                    $('.box', $(self.body)).eq(i).removeClass('img' + nowIndex).addClass('img' + (pos));
                }
                //给中间的加上超链接
                self.addImageUrl($('.img' + Math.floor(self.len / 2)))
            });
        },
        autoSlide: function () {
            var self = this;
            this.startInterval();

            $('.box').hover(function () {
                clearInterval(self.timer);
            }, function () {
                self.startInterval();
            });
        },
        startInterval: function () {
            var self = this;
            this.timer = setInterval(function () {
                self.autoMove();
            }, this.defaultOption.interval);
        },
        autoMove: function () {
            //移除中间的超链接
            this.removeImageUrl( $('#url') )

            for (var i = 0; i < this.len; i++) {
                var nowIndex = Number($('.box', $(this.body)).eq(i).attr('class').split('img')[1]);

                if (this.defaultOption.direction === 'left') {
                    var pos = nowIndex - 1;
                    if (pos < 0) {
                        pos = this.len + pos;
                    }
                } else {
                    var pos = nowIndex + 1;
                    if (pos > this.len - 1) {
                        pos = pos - this.len;
                    }
                }
                
                $('.box', $(this.body)).eq(i).removeClass('img' + nowIndex).addClass('img' + (pos));
            }
            //给中间的加上超链接
            this.addImageUrl($('.img' + Math.floor(this.len / 2)))
        }
    };

    $.fn.extend({
        slide: function (param) {
            var _param = param || {};
            _param.body = $(this) || $(document.body);

            new Slide(_param);
        }
    });
}(jQuery));