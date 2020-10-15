
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
            canvasid: 'awesome-canvas-' + this.index,
            currentImgIndex: -1
        }
    },
    props: {
        index: String
    },
    computed: {
    },
    methods: {
        clear() {
            if (this.context['psUnderColor'] === psData.transparent) {
                let cache = {
                    globalCompositeOperation: this.context.globalCompositeOperation,
                    strokeStyle: this.context.strokeStyle
                }
                this.context.globalCompositeOperation = 'destination-out';
                this.context.fillStyle = '#ffffff';
                this.context.fillRect(0, 0, this.width, this.height);
                this.context.globalCompositeOperation = cache['globalCompositeOperation']
                this.context.fillStyle = cache['strokeStyle']
            }
            else this.clearBoard();
            this.context.store();
        },
        showCache(delta) {
            this.currentImgIndex += delta;
            if (this.currentImgIndex === this.context.psCache.length) {
                this.$message('已前进到最新版本');
                this.currentImgIndex--;
                return;
            }
            if (this.currentImgIndex === -1) {
                this.$message('已回退到最初版本');
                this.currentImgIndex++;
                return;
            }
            this.context.putImageData(this.context.psCache[this.currentImgIndex], 0, 0);
        },
        imageData() {
            return this.context.canvas.toDataURL('image/jpg', 0.8);
        },
        setHandler(handler = null) {
            if (handler) {
                // 激活解绑事件
                if (this.handler.hasOwnProperty('onUnBind'))
                    this.handler.onUnBind();

                this.handler = handler;
                // 初始化 context
                this.handler.onBind(this.context);
            }

            else
                this.handler = {
                    onMouseDown: (e) => console.log('mousedown')
                }
        },
        init(meta) {
            this.context = this.$refs.board.getContext("2d");

            this.width = meta.width;
            this.height = meta.height;
            this.context['psUnderColor'] = meta.undercolor;
            this.context['psCache'] = [];

            let self = this;
            this.context.store = function () {
                // 如果回退到某一步后，进行新的修改，则会从这一步开始重新缓存，即删除之前的缓存
                if (self.currentImgIndex + 1 < this.psCache.length) {
                    this.psCache.splice(self.currentImgIndex + 1, this.psCache.length);
                }
                // 在这个里面 'this' 是 context
                this.psCache.push(this.getImageData(0, 0, this.canvas.width, this.canvas.height));
                // 紧跟缓存的图片数量
                self.currentImgIndex = this.psCache.length - 1;
                // 最多缓存 20 步
                if (this.psCache.length > 20) this.psCache.shift();
            };

            let initialization = {
                board: this.setBoard,
                image: this.setImage
            }

            // canvas每当高度或宽度被重设时，画布内容就会被清空，一定要在渲染完成（宽高设定好）后去操作
            Vue.nextTick(function () {
                initialization[meta.type](meta);
            })
            
            // 绑定鼠标事件
            this.bindEvents();
        },
        clearBoard() {
            this.context.fillStyle = this.context['psUnderColor'];
            this.context.fillRect(0, 0, this.width, this.height);     // 绘制矩形，填充的默认颜色为黑色
        },
        setBoard(meta) {
            this.clearBoard();
            this.context.store();
        },
        setImage(meta) {
            var img = new Image();
            let context = this.context;
            img.onload = function () {
                context.drawImage(img, 0, 0);
                context.store();
            };
            img.src = meta.path;
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
        },
    },
    mounted() {
        // console.log('canvas mounted');
    }
})