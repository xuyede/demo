( function () {
    window.Background = class Background {
        constructor () {
            //获取背景
            this.image = game.imgDomList['bg_night']
            //背景宽高
            this.W = 288
            this.H = 512
            //背景定位
            this.X = 0
            this.Y = game.canvas.height * 0.618 - this.H * 0.618

            this.speed = .8
        }

        //渲染
        render () {
            var ctx = game.ctx
            //渲染背景
            ctx.drawImage(this.image, this.X, this.Y)
            ctx.drawImage(this.image, this.X + this.W, this.Y)
            ctx.drawImage(this.image, this.X + this.W * 2, this.Y)
            //渲染天空猫腻图
            ctx.fillStyle = 'rgb(0, 135, 147)'
            ctx.fillRect(0, 0, game.canvas.width, this.Y)
            //渲染大地猫腻图
            ctx.fillStyle = 'rgb(0, 163, 0)'
            ctx.fillRect(0, this.Y + this.H - 10, game.canvas.width, game.canvas.height - this.Y - this.H + 20)

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