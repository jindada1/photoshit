

// 图片编辑窗口
Vue.component('ps-window', {
    template: '\
        <div style="display: flex; flex-direction: row; height: 100%;">\
            <div style="flex: 0 0 150px;">\
                <el-menu style="border-right: none" @select="toolSelected" :default-active="currentToolIndex">\
                    <el-menu-item v-for="(tool, index) in tools" :index="index.toString()" :key="tool.name">\
                        <i class="el-icon-menu"></i>\
                        <span slot="title">{{tool.title}}</span>\
                    </el-menu-item>\
                </el-menu>\
            </div>\
            <div id="dropZone" style="flex-grow: 1; flex-shrink: 1; display: flex;" class="ps-transparent-background">\
                <ps-canvas ref="canvas"></ps-canvas>\
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
                            <el-tooltip effect="dark" content="撤销上一步" placement="top-start">\
                                <el-button plain icon="el-icon-back" />\
                            </el-tooltip>\
                        </el-col>\
                        <el-col :span="8">\
                            <el-tooltip effect="dark" content="恢复" placement="top">\
                                <el-button plain icon="el-icon-right" />\
                            </el-tooltip>\
                        </el-col>\
                        <el-col :span="8">\
                            <el-tooltip effect="dark" content="清空画布" placement="top-end">\
                                <el-button plain icon="el-icon-delete"/>\
                            </el-tooltip>\
                        </el-col>\
                    </el-row>\
                    <el-button plain>将图片另存为</el-button>\
                </div>\
            </div>\
        </div>\
        ',
    data() {
        return {
            tools: [
                {
                    'title': '查看',
                    'name': 'see',
                    'handler': See()
                },
                {
                    'title': '画笔',
                    'name': 'pen',
                    'handler': Pen()
                },
                {
                    'title': '橡皮',
                    'name': 'eraser',
                    'handler': Eraser()
                },
                {
                    'title': '裁剪',
                    'name': 'cut',
                    'handler': Cut()
                },
            ],
            currentToolIndex: '0',
            meta: this.metaData
        }
    },
    props: {
        metaData: Object
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
        console.log('window mounted')
        // 初始化画布
        this.$refs.canvas.init(this.meta)
        // 激活拖拽
        this.enableDragIn();
        // 选择模式
        this.toolSelected('0');
    }
})