// 图片编辑窗口
Vue.component('ps-window', {
    template: '\
        <div style="display: flex; flex-direction: row; height: 100%;">\
            <div style="flex: 0 0 200px;">\
                <el-menu style="border-right: none" @select="modeSelected" :default-active="currentMode">\
                    <el-menu-item index="0">\
                        <i class="el-icon-menu"></i>\
                        <span slot="title">选择</span>\
                    </el-menu-item>\
                    <el-menu-item index="1">\
                        <i class="el-icon-menu"></i>\
                        <span slot="title">画笔</span>\
                    </el-menu-item>\
                    <el-menu-item index="2">\
                        <i class="el-icon-menu"></i>\
                        <span slot="title">裁剪</span>\
                    </el-menu-item>\
                </el-menu>\
            </div>\
            <div id="dropZone" style="flex-grow: 1; flex-shrink: 1; display: flex;" ref="canvasHolder">\
                <canvas ref="board" :width="canvasWidth" :height="canvasHeight" style="margin: auto; background-color:gray"></canvas>\
            </div>\
            <div style="flex: 0 0 200px; display: flex; flex-direction: column;">\
                <div style="background-color: antiquewhite; flex-basis: 100px;">\
                    <el-button-group>\
                        <el-button type="primary" icon="el-icon-edit"></el-button>\
                        <el-button type="primary" icon="el-icon-share"></el-button>\
                        <el-button type="primary" icon="el-icon-delete"></el-button>\
                    </el-button-group>\
                </div>\
                <div style="background-color: azure; flex: 1;">\
                    <el-carousel ref="operationPanels" class="ps-window-panels" indicator-position="none" arrow="never" :autoplay="false">\
                        <el-carousel-item>\
                            <h3>基本信息</h3>\
                        </el-carousel-item>\
                        <el-carousel-item v-for="item in 2" :key="item">\
                            <h3>{{ item }}</h3>\
                        </el-carousel-item>\
                    </el-carousel>\
                </div>\
            </div>\
        </div>\
        ',
    data() {
        return {
            canvasWidth: 300,
            canvasHeight: 300,
            currentMode: '0'
        }
    },
    methods: {
        // 激活鼠标拖拽文件
        enableDragIn() {
            var dropZone = document.getElementById('dropZone');

            dropZone.addEventListener('dragover', function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
                dropZone.style.border = "2px dotted gray";
            }, false);

            dropZone.addEventListener("dragleave", function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                dropZone.style.border = "none";
            }, false);

            dropZone.addEventListener('drop', function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                dropZone.style.border = "none";
                var files = evt.dataTransfer.files;

                for (var i = 0, f; f = files[i]; i++) {
                    console.log(f.name)
                }
            }, false);
        },
        modeSelected(menuIndex) {
            // 切换编辑面板
            this.$refs.operationPanels.setActiveItem(menuIndex);
            var mode = parseInt(menuIndex);
            // 切换图片编辑模式 
            [
                this.modeDraging,
                this.modeDrawing,
                this.modeCutting
            ][mode]();
            this.currentMode = menuIndex;
        },
        // 移动模式
        modeDraging() {
            console.log('移动模式')
        },
        // 涂鸦模式
        modeDrawing() {
            // for debug
            console.log('涂鸦模式');

            let board = this.$refs.board;
            // 创建画布上下文
            var ctx = board.getContext("2d");
            // 标记鼠标是否按下
            var isDown = false;
            // 获取画布的left值
            var left = board.getBoundingClientRect().left;
            var top = board.getBoundingClientRect().top;

            // 用于存放画布图片截图的数组
            var imgs = [];

            // 当前组件对象
            let _this = this;

            // 线条的结束端点样式
            ctx.lineCap = "round";
            // 设置两条线相交时，所创建的拐角类型
            ctx.lineJion = "round";

            board.addEventListener("mousedown", function(e) {
                isDown = true;
                // 起始/重置一条路径
                ctx.beginPath();
                // 把路径移动到画布中的指定点，不创建线条
                ctx.moveTo(e.clientX - left, e.clientY - top);
                // 获取当前画布的图像
                var pic = ctx.getImageData(0, 0, _this.canvasWidth, _this.canvasHeight);
                // 将当前图像存入数组，用于撤销每一笔
                imgs.push(pic);
                // ctx.moveTo(e.clientX, e.clientY);
            })

            board.addEventListener("mousemove", function(e) {
                if (isDown) {
                    // ctx.lineTo(e.clientX, e.clientY);
                    // 添加一个新点，在画布中创建从该点到最后指定点的线条
                    ctx.lineTo(e.clientX - left, e.clientY - top);
                    ctx.stroke();
                }
            });

            board.addEventListener("mouseout", function(e) {
                // 当鼠标移出画布区域时,创建从当前点回到起始点的路径
                ctx.closePath();
                isDown = false;
            })

            board.addEventListener("mouseup", function(e) {
                // 当鼠标抬起时,创建从当前点回到起始点的路径
                ctx.closePath();
                isDown = false;
            })

            // $(".clear").click(function() {
            //     ctx.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight); //创建一个等大画布覆盖
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
        // 裁剪模式
        modeCutting() {
            console.log('裁剪模式')
        }
    },
    mounted() {
        this.enableDragIn()
        this.modeSelected(this.currentMode);
    }
})