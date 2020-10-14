
// tabs窗口
Vue.component('ps-canvas', {
    template: '\
        <canvas :id="canvasid" ref="board" :width="width" :height="height" style="margin: auto; box-shadow: 0px 0px 3px 0px gray;">\
        </canvas>\
    ',
    data() {
        return {
            width: 300,
            height: 300,
            context: null,
            handler: {},
            canvasid: 'awesome-canvas-' + this.index
        }
    },
    props: {
        index: String
    },
    computed: {
    },
    methods: {
        setHandler(handler = null) {
            if (handler) {
                this.handler = handler;
                // 初始化 context
                this.handler.onBind(this.context);
            }

            else
                this.handler = {
                    onMouseDown: (e) => console.log('mousedown'),
                    onMouseOut: (e) => console.log('mouseout'),
                    onMouseUp: (e) => console.log('mouseup')
                }
        },
        addCustomProperty() {
            // ps 夹带的私货在这里装车（装进 context）
            this.context['psUnderColor'] = 'rgba(0,0,0,0)';
        },
        init(meta) {
            this.context = this.$refs.board.getContext("2d");
            this.addCustomProperty();

            switch (meta.type) {
                case 'board':
                    this.setBoard(meta);
                    break;

                case 'image':
                    this.setImage(meta);
                    break;

                default:
                    break;
            }
            // 绑定鼠标事件
            this.bindEvents();
        },
        setBoard(meta) {
            this.width = meta.width;
            this.height = meta.height;
            this.context['psUnderColor'] = meta.undercolor;

            let self = this;
            // canvas每当高度或宽度被重设时，画布内容就会被清空，一定要在渲染完成（宽高设定好）后去操作
            Vue.nextTick(function () {
                // console.log('nexttick in canvas');
                self.clearBoard();
            })
        },
        setImage(meta) {
            var img = new Image();
            let self = this;
            img.onload = function () {
                self.width = this.width;
                self.height = this.height;
                Vue.nextTick(function () {
                    self.context.drawImage(img, 0, 0);
                })
            };
            img.src = meta.path;
        },
        clearBoard() {
            this.context.fillStyle = this.context['psUnderColor'];
            this.context.fillRect(0, 0, this.width, this.height);     // 绘制矩形，填充的默认颜色为黑色
        },
        bindEvents() {
            // 设置默认事件处理器
            this.setHandler();

            let board = this.$refs.board;
            // 创建画布上下文
            var ctx = this.context;

            // 获取画布的left值
            var left = 0;
            var top = 0;

            // 用于存放画布图片截图的数组
            var imgs = [];

            // 当前组件对象
            let self = this;

            board.addEventListener("mousedown", function (e) {
                if (!self.handler.hasOwnProperty('onMouseDown')) return;
                // getBoundingClientRect 是会动态变化的，根据渲染来的
                left = board.getBoundingClientRect().left;
                top = board.getBoundingClientRect().top;
                self.handler.onMouseDown(e.clientX - left, e.clientY - top, ctx, e)
            })

            board.addEventListener("mousemove", function (e) {
                if (!self.handler.hasOwnProperty('onMouseMove')) return;
                self.handler.onMouseMove(e.clientX - left, e.clientY - top, ctx, e)
            });

            board.addEventListener("mouseout", function (e) {
                if (!self.handler.hasOwnProperty('onMouseOut')) return;
                self.handler.onMouseOut(e.clientX - left, e.clientY - top, ctx, e)
            })

            board.addEventListener("mouseup", function (e) {
                if (!self.handler.hasOwnProperty('onMouseUp')) return;
                self.handler.onMouseUp(e.clientX - left, e.clientY - top, ctx, e)
            })

            // $(".clear").click(function() {
            //     ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height); //创建一个等大画布覆盖
            // });
            // $(".reset").click(function() {
            //     if (imgs.length > -1) {
            //         ctx.putImageData(imgs.pop(), 0, 0); //删除图像数组最后一位
            //     }
            // })

        },
    },
    mounted() {
        // console.log('canvas mounted');
    }
})