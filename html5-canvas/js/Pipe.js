( function () {
    window.Pipe = class Pipe {
        constructor () {
            //上管子
            this.downPipe = game.imgDomList['pipe_down']
            //下管子
            this.upPipe = game.imgDomList['pipe_up']
            //随机上管子长度
            this.randomHeight = Math.random() * 150 + 20
            //上管子的定位
            this.X = game.canvas.width
            this.Y = 0
            //管子显示总高度
            this.totalH = game.canvas.height * 0.618 + 80
            //管子的宽高
            this.H = 320
            this.W = 52
            //管子间隙
            this.space = 130
            //上管子的高度
            this.downH = this.H - this.randomHeight
            //下管子的高度
            this.upH = this.totalH - this.downH - this.space
            //是否通过管子
            this.passPipe = false
        }

        //渲染
        render () {
            var ctx = game.ctx
            
            //渲染上管子
            ctx.drawImage(this.downPipe, 0, this.randomHeight, this.W, this.downH, this.X, this.Y, this.W, this.downH)
            //渲染下管子
            ctx.drawImage(this.upPipe, 0, 0, this.W, this.upH, this.X, this.downH + this.space, this.W, this.upH)
            
            // ctx.font = '14px consolas'
            // ctx.textAlign = 'center'
            // ctx.fillStyle = '#fff'
            // ctx.fillText(`${this.passPipe}`, this.X + this.W / 2, 100)
        
        }

        //更新
        update () {
            this.X--
            //当管子从屏幕左端消失后, 把该管子从管子列表和实例对象列表中删除
            if (this.X < -this.W) {
                this.without('instanceSceneThree', this)
                this.without('pipeList', this)
            }
            //小鸟与管子的碰撞检测
            this && this.impactTest()
            
        }

        //碰撞检测
        impactTest () {
            var bird = game.sm.bird

            //下管子碰撞检测 (左 上 右)
            if ( (this.X < bird.X + bird.W - 10) && (this.totalH - this.upH < bird.Y + bird.H - 10) && (this.X + this.W > bird.X + 10) ) {
                console.log('碰撞下管子')
                // clearInterval(game.timer)
                game.sm.enter(3)
            }
            //上管子检测 (左 下 右)
            if ( (this.X < bird.X + bird.W - 10) && (this.downH > bird.Y + 10) && (this.X + this.W > bird.X + 10)) {
                console.log('碰撞上管子')
                // clearInterval(game.timer)
                game.sm.enter(3)
            }
            //通过管子
            if ( this.X + this.W < bird.X && !this.passPipe) {
                this.passPipe = true
                //分数加一
                game.sm.score++
            }
        }

        //删除数组的东西
        without (params, target) {
            /* 
                注意
                截取原数组, 会出现卡顿
                var number = game[params].findIndex( ele => ele === target )  
                game[params].splice(number, 1)
            */

            // 生成新数组, 整个替代旧数组
            var newArr = game.sm[params].filter(ele => ele !== target)
            game.sm[params] = newArr
        }
    }
} () )