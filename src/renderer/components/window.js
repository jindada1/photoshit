

// 图片编辑窗口
Vue.component('ps-window', {
    template: '\
        <div style="display: flex; flex-direction: row; height: 100%;">\
            <div style="flex: 0 0 120px;">\
                <el-menu style="border-right: none" @select="toolSelected" :default-active="currentToolIndex">\
                    <el-menu-item v-for="(tool, index) in tools" :index="index.toString()" :key="tool.name">\
                        <i :class="tool.icon"></i>\
                        <span slot="title">{{tool.title}}</span>\
                    </el-menu-item>\
                </el-menu>\
            </div>\
            <div id="dropZone" style="flex-grow: 1; flex-shrink: 1; display: flex;" class="ps-transparent-background ps-canvas-container">\
                <ps-canvas ref="canvas" :index="windowIndex"></ps-canvas>\
            </div>\
            <div style="flex: 0 0 260px; display: flex; flex-direction: column;">\
                <div style="flex: 1;">\
                    <el-carousel ref="operationPanels" class="ps-window-panels" indicator-position="none" arrow="never" :autoplay="false">\
                        <el-carousel-item v-for="tool in tools" :key="tool.name" :name="tool.name">\
                            <component :is="tool.name" :name="tool.name" :instance="tool.handler"></component>\
                        </el-carousel-item>\
                    </el-carousel>\
                </div>\
                <div class="button-area">\
                    <el-row :gutter="10">\
                        <el-col :span="8">\
                            <el-tooltip effect="dark" content="撤销" placement="top">\
                                <el-button plain icon="el-icon-back" @click="step(-1)"/>\
                            </el-tooltip>\
                        </el-col>\
                        <el-col :span="8">\
                            <el-tooltip effect="dark" content="恢复" placement="top">\
                                <el-button plain icon="el-icon-right" @click="step(1)"/>\
                            </el-tooltip>\
                        </el-col>\
                        <el-col :span="8">\
                            <el-tooltip effect="dark" content="清空画布" placement="top">\
                                <el-button plain icon="el-icon-delete" @click="clearCanvas"/>\
                            </el-tooltip>\
                        </el-col>\
                    </el-row>\
                    <el-button plain @click="saveCanvas">将图片另存为</el-button>\
                </div>\
            </div>\
        </div>\
        ',
    data() {
        return {
            tools: [
                {
                    title: '查看',
                    icon: 'el-icon-view',
                    name: 'see',
                    handler: See()
                },
                {
                    title: '画笔',
                    icon: 'el-icon-edit',
                    name: 'pen',
                    handler: Pen()
                },
                {
                    title: '橡皮',
                    icon: 'el-icon-smoking',
                    name: 'eraser',
                    handler: Eraser()
                },
                {
                    title: '调整',
                    icon: 'el-icon-set-up',
                    name: 'adjust',
                    handler: Adjust()
                },
                {
                    title: '滤镜',
                    icon: 'el-icon-film',
                    name: 'ps-filter',
                    handler: Filter()
                },
                {
                    title: '裁剪',
                    icon: 'el-icon-scissors',
                    name: 'cut',
                    handler: Cut()
                },
            ],
            currentToolIndex: '0',
            meta: this.metaData,
            windowIndex: this.index,
        }
    },
    props: {
        metaData: Object,
        index: String
    },
    methods: {
        saveCanvas() {
            dialog.showSaveDialog({
                title: 'Testing a save dialog',
                defaultPath: 'image.jpg'
            }).then((data) => {
                // Get the DataUrl from the Canvas
                const url = this.$refs.canvas.imageData();

                // remove Base64 stuff from the Image
                const base64Data = url.replace(/^data:image\/png;base64,/, "");

                // store it
                fs.writeFile(data.filePath, base64Data, 'base64', function (err) {
                    if (err) dialog.showMessageBox(null, {
                        type: 'error',
                        title: '错误',
                        message: '保存图片失败',
                        detail: err,
                    });
                    else dialog.showMessageBox(null, {
                        type: 'info',
                        title: '成功',
                        message: '保存成功',
                        detail: '路径为：' + data.filePath,
                    });
                });
            });
        },
        step(delta) {
            this.$refs.canvas.showCache(delta);
        },
        clearCanvas() {
            this.$refs.canvas.clear();
        },
        // 激活鼠标拖拽文件
        enableDragIn() {
            var dropZone = document.getElementById('dropZone');

            dropZone.addEventListener('dragover', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
                dropZone.style.border = "2px dotted gray";
            }, false);

            dropZone.addEventListener("dragleave", function (evt) {
                evt.preventDefault();
                evt.stopPropagation();
                dropZone.style.border = "none";
            }, false);

            dropZone.addEventListener('drop', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                dropZone.style.border = "none";
                var files = evt.dataTransfer.files;

                for (var i = 0, f; f = files[i]; i++) {
                    console.log(f.name)
                }
            }, false);
        },
        toolSelected(toolIndex) {
            // 更新 ui
            this.currentToolIndex = toolIndex;
            // toolIndex 是 string, 把它转成 number
            toolIndex = parseInt(toolIndex);
            // 获取当前工具
            let tool = this.tools[toolIndex];
            // 切换编辑面板
            this.$refs.operationPanels.setActiveItem(tool.name);
            // 设置处理器
            if (tool.handler) {
                this.$refs.canvas.setHandler(tool.handler);
            }
        },
    },
    mounted() {
        // console.log('window mounted');
        // 初始化画布
        this.$refs.canvas.init(this.meta)
        // 激活拖拽
        this.enableDragIn();

        this.toolSelected('0');
    }
})