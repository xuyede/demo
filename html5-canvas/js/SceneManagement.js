(function () {
    window.SM = class SM {
        constructor () {
            this.sceneNumber = 0
            this.score = 0
            //设置最高分
            window.localStorage.getItem('topScore') == null && window.localStorage.setItem('topScore', 0)
            
            //对象实例化
            this.instanceInit()

            //场景一的对象
            this.instanceSceneOne = this.getInstanceList('background', 'land', 'bird')
            //场景一初始化变量
            this.initSceneOne()
            
            //场景二的对象
            this.instanceSceneTwo = this.getInstanceList('background', 'land', 'bird')
            //场景二初始化变量
            this.initSceneTwo()

            //场景三的对象
            this.instanceSceneThree = this.getInstanceList('background', 'land', 'bird')
            //场景三初始化变量
            this.initSceneThree()

            //场景四的对象
            this.instanceSceneFour = this.getInstanceList('background', 'land', 'bird')
            //场景四初始化变量
            this.initSceneFour()

            //绑定事件
            this.bindEvent()
        }
        
        /* 
            公用方法
            getInstanceList 
            instanceInit
            updateInstance
            bindEvent
            logScore
        */
        //获取场景的对象
        getInstanceList (...arg) {
            return arg.map(str => this[str])
        }
        //对象实例化
        instanceInit () {
            this.background = new Background
            this.land = new Land
            this.bird = new Bird
        }
        //场景对象的实例方法的更新
        updateInstance (instanceList) {
            instanceList.forEach(instance => {
                instance.render()
                //执行小鸟的翅膀扇动方法
                this.sceneNumber !== 3 && instance.changeBirdWing && instance.changeBirdWing()
                //如果是场景一或场景二的小鸟, 则不需要执行update
                if (
                    (instance instanceof Bird && this.sceneNumber === 0)
                    || (instance instanceof Bird && this.sceneNumber === 1)
                    || (this.sceneNumber === 3)
                ) 
                    return

                instance.update()
            })
        }
        //事件绑定
        bindEvent () {
            game.canvas.addEventListener('mousedown', e => {
                if (this.sceneNumber === 0) {
                    var clickX = e.clientX,
                    clickY = e.clientY

                    //按钮点击
                    if (
                        clickX > game.canvas.width / 2 - 58 && 
                        clickX < game.canvas.width / 2 + 58 && 
                        clickY > game.canvas.height * .5 && 
                        clickY < game.canvas.height * .5 + 70
                    ) {
                        //进入游戏提示场景
                        this.enter(1)
                    }
                } else if (this.sceneNumber === 1) {
                    //进入游戏场景
                    this.enter(2)
                } else if (this.sceneNumber === 2) {
                    //场景三小鸟点击运动
                    this.bird.changeState()
                } else if (this.sceneNumber === 3) {
                    this.enter(1)
                }
            }, null)
        }
        //打印分数
        logScore () {
            var numberSpace = 30,
                numberW = 24,
                scoreStr = this.score.toString()
            //居中算法: 中轴 + 间距 - 总数字宽度的一半
            for (let i = 0; i < scoreStr.length; i++) {
                game.ctx.drawImage(game.imgDomList['font_' + scoreStr.charAt(i)], game.canvas.width / 2 - scoreStr.length / 2 * numberW + numberSpace * i, game.canvas.width * .15)
            }

            // this.ctx.drawImage(this.imgDomList['font_1'], this.canvas.width / 2 - 1.5 * numberW, this.canvas.height * .15)
            // this.ctx.drawImage(this.imgDomList['font_0'], this.canvas.width / 2 - 1.5 * numberW + numberSpace, this.canvas.height * .15)
            // this.ctx.drawImage(this.imgDomList['font_2'], this.canvas.width / 2 - 1.5 * numberW + numberSpace * 2, this.canvas.height * .15)
        }


        /* 
            场景四的方法
            initSceneFour 
            sceneFourRender
            sceneFourUpdate
            fillGameOverScoreRank
        */
        //绘制结束提示, 分数, 排名
        fillGameOverScoreRank () {
            var medal = 3

            if (this.score > 20 && this.score < 50) {
                medal = 2
            } else if (this.score > 50) {
                medal = 1
            }

            //绘制结束标题
            game.ctx.drawImage(game.imgDomList['text_game_over'], this.gameOver_X, this.gameOver_Y)
            //绘制分数
            game.ctx.drawImage(game.imgDomList['score'], this.score_X, this.score_Y)
            //绘制奖牌
            game.ctx.drawImage(game.imgDomList['no' + medal], this.score_X + 32, this.score_Y + 45)
            //绘制分数
            game.ctx.font = '16px consolas'
            game.ctx.textAlign = 'center'
            game.ctx.fillStyle = '#000'
            game.ctx.fillText(this.score, this.score_X + 190, this.score_Y + 50)
            //绘制最高分数
            game.ctx.fillText(window.localStorage.getItem('topScore'), this.score_X + 190, this.score_Y + 90)
            //绘制提示语
            game.ctx.fillText('点击任意地方重新游戏', game.canvas.width / 2, game.canvas.height * .9)
        }
        //初始化场景四的变量
        initSceneFour () {
            //把场景三的实例对象赋予给场景四
            this.instanceSceneFour = this.instanceSceneThree
            //游戏结束标题的位置
            this.gameOver_X = game.canvas.width / 2 - 102
            this.gameOver_Y = 150
            //分数位置
            this.score_X = game.canvas.width / 2 - 119
            this.score_Y = 250
        }
        //场景四的渲染
        sceneFourRender () {
            //更新实例对象的方法
            this.updateInstance(this.instanceSceneFour)
            //绘制结束提示, 分数, 排名
            this.fillGameOverScoreRank()
        }
        //场景四的更新
        sceneFourUpdate () {
            //设置最高分数
            if (window.localStorage.getItem('topScore') < this.score) {
                window.localStorage.setItem('topScore', this.score)
            }
        }


        /* 
            场景三的方法
            initSceneThree
            sceneThreeRender
            createPipeDependFNO
        */
        //初始化场景三的变量
        initSceneThree () {
            //管子列表
            this.pipeList = []
            //重置场景三的实例对象, 把管子类剔除
            this.instanceSceneThree = this.instanceSceneThree.filter(instance => {
                return !(instance instanceof Pipe)
            })
        }
        //场景三的渲染
        sceneThreeRender () {
            //更新实例对象的方法
            this.updateInstance(this.instanceSceneThree)
            //根据主帧编号生成管子
            this.createPipeDependFNO()
            //打印分数
            this.logScore()
        }
        createPipeDependFNO () {
            //生成管子
            if (game.frameNumber % 250 === 0) {
                var pipe = new Pipe
                //放进管子列表和场景三的实例对象中渲染更新
                this.instanceSceneThree.push( pipe )
                this.pipeList.push( pipe )
            }
        }


        /* 
            场景二的方法
            fillTipOfGame
            sceneTwoRender
            initSceneTwo
        */
        //初始化场景二的变量
        initSceneTwo () {
            //设置小鸟位置和掉落帧数, 防止切换下一个场景时速率发生错误
            this.bird.X = game.canvas.width / 2 - 24
            this.bird.Y = game.canvas.height * 0.72 * 0.40
            this.bird.angle = 0
            this.bird.t = 0
            this.score = 0
        }
        //绘制游戏提示
        fillTipOfGame () {
            //绘制游戏提示
            game.ctx.drawImage(game.imgDomList['tutorial'], game.canvas.width / 2 - 57, 300)
            //绘制准备开始标题
            game.ctx.drawImage(game.imgDomList['text_ready'], game.canvas.width / 2 - 98, 150)
        }
        //场景二的渲染
        sceneTwoRender () {
            //更新实例对象的方法
            this.updateInstance(this.instanceSceneTwo)
            //绘制游戏提示
            this.fillTipOfGame()
        }

        /* 
            场景一的方法
            fillBirdAndButton
            sceneOneRender
            sceneOneUpdate
            initSceneOne
        */
        //场景一绘制小鸟 / 标题 / 开始按钮
        fillBirdAndButton () {
            //重置小鸟的位置
            this.bird.X = this.bird_X
            this.bird.Y = this.bird_Y
            //绘制标题
            game.ctx.drawImage(game.imgDomList['title'], this.title_X, this.title_Y)
            //绘制开始按钮
            game.ctx.drawImage(game.imgDomList['button_play'], this.start_btn_X, this.start_btn_Y)
        }
        //场景一的渲染
        sceneOneRender () {
            //更新实例对象的方法
            this.updateInstance(this.instanceSceneOne)
            //绘制小鸟和开始按钮
            this.fillBirdAndButton()
        }
        //场景一的更新
        sceneOneUpdate () {
            //小鸟移动
            this.bird_X++
            if (this.bird_X >= game.canvas.width / 2 - 24) {
                this.bird_X = game.canvas.width / 2 - 24
            }
            //标题移动
            this.title_Y++
            if (this.title_Y >= 150) {
                this.title_Y = 150
            }
        }
        //初始化场景一的变量
        initSceneOne () {
            //小鸟的初始位置
            this.bird_X = -48
            this.bird_Y = game.canvas.height * 0.72 * 0.40
            //标题的初始位置
            this.title_X = game.canvas.width / 2 - 89
            this.title_Y = -48
            //开始按钮的初始位置
            this.start_btn_X = game.canvas.width / 2 - 58
            this.start_btn_Y = game.canvas.height * .5
        }



        //渲染
        render () {
            switch (this.sceneNumber) {
                case 0:
                    this.sceneOneRender()
                    break;
                case 1:
                    this.sceneTwoRender()
                    break;
                case 2:
                    this.sceneThreeRender()
                    break;
                case 3:
                    this.sceneFourRender()
                    break;
                default:
                    break;
            }
        }

        //更新
        update () {
            switch (this.sceneNumber) {
                case 0:
                    this.sceneOneUpdate()
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    this.sceneFourUpdate()
                    break;
                default:
                    break;
            }
        }

        //进入场景前的初始化, 帧编号归零, 初始化对应场景的变量
        enter (sceneNumber) {
            this.sceneNumber = sceneNumber
            switch (sceneNumber) {
                case 0:
                    console.log('进入场景一')
                    game.frameNumber = 0
                    this.initSceneOne()
                    break;
                case 1:
                    console.log('进入场景二')
                    game.frameNumber = 0
                    this.initSceneTwo()
                    break;
                case 2:
                    console.log('进入场景三')
                    game.frameNumber = 0
                    this.initSceneThree()
                    break;
                case 3:
                    console.log('进入场景四')
                    game.frameNumber = 0
                    this.initSceneFour()
                    break;
                default:
                    break;
            }
        }
    }
} ())