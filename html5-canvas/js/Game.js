(function () {
    window.Game = class Game {
        constructor () {
            //获取canvas与画笔
            this.canvas = document.getElementById('myCanvas')
            this.ctx = this.canvas.getContext('2d')
            //帧编号
            this.frameNumber = 0
            //游戏引擎速率
            this.intervalTime = 16
            //图片dom列表
            this.imgDomList = {}
            //游戏引擎
            this.timer = null
            //初始化canvas宽高
            this.initWidthHeight()
            //获取图片资源
            this.getImage()
        }

        //获取图片资源
        getImage () {
            var imgObj = []
            
            fetch('../data/image.json')
                .then(resp => resp.json())
                .then(res => {
                    imgObj = res.images
                    this.loadResource(imgObj)
                })
        }

        //加载图片资源
        loadResource (images) {
            var doneCount = 0

            images.forEach( img => {
                var image = new Image()
                image.src = img.url
                this.imgDomList[img.name] = image
                
                image.onload = () => {
                    doneCount++
                    //每张图片加载完成都清屏一次
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    this.ctx.font = '20px 微软雅黑'
                    this.ctx.textAlign = 'center'
                    this.ctx.fillText(`正在加载资源 ${doneCount}/${images.length}`, this.canvas.width / 2, this.canvas.height * (1 - 0.618))

                    if (doneCount === images.length) {
                        console.log('资源加载完成')
                        //资源加载完后开始游戏
                        this.start()
                    }
                }
            })
        }

        //游戏主循环
        mainLoop () {
            this.timer = setInterval( () => {
                //每帧清屏
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                //每帧执行场景管理器的渲染和更新
                this.sm.render()
                this.sm.update()
                //帧编号递增
                this.frameNumber++
            }, this.intervalTime )
        }
     
        //开始游戏
        start () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            //实例化场景管理器
            this.sm = new SM()
            //开启游戏主循环
            this.mainLoop()
        }

        //初始化canvas宽高
        initWidthHeight () {
            //获取可视窗口宽高
            var windowH = document.documentElement.clientHeight;
            var windowW = document.documentElement.clientWidth;
            //I6P:414 736
            if (windowH > 736) {
                windowH = 736;
            } else if (windowH < 568) {
                windowH = 568;
            }
            //I5:320 568
            if (windowW > 414) {
                windowW = 414;
            } else if (windowW < 320) {
                windowW = 320;
            }
            this.canvas.height = windowH;
            this.canvas.width = windowW;
        }
    }
} ())