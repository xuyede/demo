( function () {
    window.Bird = class Bird {
        constructor () {
            //随机小鸟颜色
            this.color = Math.floor(Math.random() * 3)
            //小鸟翅膀扇动
            this.swing = 0
            //小鸟
            this.bird = game.imgDomList[`bird${this.color}_${this.swing}`]
            //小鸟宽高
            this.W = 48
            this.H = 48
            //小鸟的定位
            this.X = game.canvas.width * 0.25;
            this.Y = game.canvas.height * 0.72 * 0.40;
            //小鸟运动的最大范围
            this.allH = game.canvas.height * 0.618 + 45
            //小鸟运动速率
            this.a = .3
            //小鸟运动帧数,从下落开始计时
            this.t = 0
            //小鸟旋转角度
            this.angle = 0
            //小鸟的状态 A为掉落, B为上升
            this.state = 'A'
        }

        //渲染
        render () {
            //渲染小鸟
            var ctx = game.ctx

            //使用 save和 restore保存/恢复 改变前的状态
            ctx.save()
            //改变旋转原点
            ctx.translate( this.X + (this.W / 2), this.Y + (this.H / 2) )
            ctx.rotate(this.angle)
            ctx.drawImage(this.bird, -this.W / 2, -this.H / 2)
            ctx.restore()
        }

        //更新
        update () {
            //改变小鸟的翅膀
            this.changeBirdWing()
            //小鸟运动
            this.birdMove()
        }

        //小鸟状态切换
        changeState () {
            //上升状态
            this.state = 'B'
            //重新计时
            this.t = 0
            //默认抬头
            this.angle = -0.6
        }

        //小鸟运动
        birdMove () {
            //小鸟运动帧数每帧增加
            this.t++
            //小鸟旋转角度
            this.angle += .03

            if (this.state === 'A') {
                //掉落算法  s = at
                this.Y += this.a * this.t
               
                //下落限制
                if (this.Y > this.allH) {
                    this.Y = this.allH
                    // this.angle = 0
                    //进入结算场景
                    game.sm.enter(3)
                }

            } else {
                //上升 13帧后切换为自由落体运动 
                this.Y -= this.a * (13 - this.t)

                if (this.t > 13) {
                    //重新计时
                    this.t = 0
                    //13帧后切换状态, 自由落体
                    this.state = 'A'
                }

                //上升限制
                if (this.Y < 0) {
                    this.Y = 0
                }

            }
        }

        //改变小鸟翅膀
        changeBirdWing () {
            // 0 1 2
            game.frameNumber % 20 === 0 && this.swing++

            if (this.swing > 2) {
                this.swing = 0
            }

            //每 20帧换一下小鸟的翅膀
            this.bird = game.imgDomList[`bird${this.color}_${this.swing}`]
        }
    }
} () )