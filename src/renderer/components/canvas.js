
// tabs窗口
Vue.component('ps-canvas', {
    template: '\
        <canvas ref="board" :width="width" :height="height" style="margin: auto;background-color: gray">\
        </canvas>\
    ',
    data() {
        return {
            width: 300,
            height: 300,
            handler: {}
        }
    },
    props: [],
    computed: {
    },
    methods: {
        setHandler(handler = null) {
            if (handler)
            {
                this.handler = handler;
                // 初始化 context
                this.handler.onBind(this.$refs.board.getContext("2d"));
            }
                
            else
                this.handler = {
                    onMouseDown: (e) => console.log('mousedown'),
                    onMouseMove: (e) => console.log('mousemove'),
                    onMouseOut: (e) => console.log('mouseout'),
                    onMouseUp: (e) => console.log('mouseup')
                }
        },
        init(meta) {
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
            // 设置默认事件处理器
            this.setHandler();
            // 绑定鼠标事件
            this.bindEvents();
        },
        setBoard(meta) {
            this.width = meta.width;
            this.height = meta.height;
        },
        setImage(meta) {
            console.log(meta)
        },
        bindEvents() {

            let board = this.$refs.board;
            // 创建画布上下文
            var ctx = board.getContext("2d");
            
            // 获取画布的left值
            var left = 0;
            var top = 0;

            // 用于存放画布图片截图的数组
            var imgs = [];

            // 当前组件对象
            let self = this;

            board.addEventListener("mousedown", function (e) {
                // getBoundingClientRect 是会动态变化的，根据渲染来的
                left = board.getBoundingClientRect().left;
                top = board.getBoundingClientRect().top;
                self.handler.onMouseDown(e.clientX - left, e.clientY - top, ctx, e)
            })

            board.addEventListener("mousemove", function (e) {
                self.handler.onMouseMove(e.clientX - left, e.clientY - top, ctx, e)
            });

            board.addEventListener("mouseout", function (e) {
                self.handler.onMouseOut(e.clientX - left, e.clientY - top, ctx, e)
            })

            board.addEventListener("mouseup", function (e) {
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
            // $(".eraser").click(function() {
            //     ctx.strokeStyle = "#fff";
            // });
            // $(".color").change(function() {
            //     ctx.strokeStyle = this.value; //改变颜色
            // });
            // $(".range").change(function() {
            //     ctx.lineWidth = this.value; //改变线条粗细
            // })

        },
    },
    mounted() {
    }
})