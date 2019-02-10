( function () {
    window.Land = class Land {
        constructor () {
            //获取大地
            this.image = game.imgDomList['land']
            //背景宽高
            this.W = 336
            this.H = 112
            //背景定位
            this.X = 0
            this.Y = game.canvas.height * 0.618 + 80

            this.speed = 1
        }

        //渲染
        render () {
            var ctx = game.ctx
            //渲染大地
            ctx.drawImage(this.image, this.X, this.Y)
            ctx.drawImage(this.image, this.X + this.W, this.Y)
            ctx.drawImage(this.image, this.X + this.W * 2, this.Y)
            // 渲染大地猫腻图
            ctx.fillStyle = 'rgb(222, 216, 149)'
            ctx.fillRect(0, this.Y + this.H, game.canvas.width, game.canvas.height - this.Y - this.H)

        }

        //更新
        update () { 
            //无缝滚动
            this.X -= this.speed
            if (this.X < -this.W) {
                this.X = 0
            }
        }
    }
} () )