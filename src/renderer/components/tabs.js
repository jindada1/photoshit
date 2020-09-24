
// tabs窗口
Vue.component('ps-tabs', {
    template: '\
        <div>\
            <el-tabs v-model="selectedTabName" type="card" @tab-remove="removeTab" @tab-click="tabClicked">\
                <el-tab-pane :style="{height: paneHeight}" v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name" closable>\
                    <ps-window/>\
                </el-tab-pane>\
                <el-tab-pane label="+" name="add"/>\
            </el-tabs>\
            <el-dialog title="创建新画布" :visible.sync="newDialogVisible">\
                <el-form ref="newDialogForm" :model="canvas" label-width="40px">\
                    <el-form-item label="名称">\
                        <el-input v-model="canvas.name"></el-input>\
                    </el-form-item>\
                    <el-form-item label="大小">\
                        <el-col :span="9">\
                            <el-input v-model="canvas.width" :onkeyup="this.numberFilter()"></el-input>\
                        </el-col>\
                        <el-col style="text-align: center;" :span="2">px</el-col>\
                        <el-col style="text-align: center;" :span="2">-</el-col>\
                        <el-col :span="9">\
                            <el-input v-model="canvas.height" :onkeyup="this.numberFilter()"></el-input>\
                        </el-col>\
                        <el-col style="text-align: center;" :span="2">px</el-col>\
                    </el-form-item>\
                    <el-form-item>\
                        <el-switch active-text="锁定纵横比" v-model="canvas.rateLocked"></el-switch>\
                    </el-form-item>\
                </el-form>\
                <div slot="footer" class="dialog-footer">\
                    <el-button @click="dialogFormVisible = false">取 消</el-button>\
                    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>\
                </div>\
            </el-dialog>\
        </div>\
    ',
    data() {
        return {
            selectedTabName: 'add',
            tabIndex: 0,
            editableTabs: [
                {
                    name: 'test',
                    title: 'test'
                }
            ],
            height: document.body.clientHeight,
            newDialogVisible: false,
            canvas: {
                name: "",
                width: "",
                height: "",
                rateLocked: false
            }
        }
    },
    computed: {
        paneHeight: function () {
            return (this.height - 56) + 'px';
        }
    },
    methods: {
        numberFilter(e) {
            this.canvas.width = this.canvas.width.replace(/[^\d.]/g,'');
            this.canvas.height = this.canvas.height.replace(/[^\d.]/g,'')
        },
        tabClicked(tab) {
            if (tab.name === 'add')
                this.createNew();
        },
        createNew() {
            this.newDialogVisible = true;
        },
        addTab(tabname) {
            let newTabName = ++this.tabIndex + '';
            this.editableTabs.push({
                title: 'Untitled-' + newTabName,
                name: newTabName
            });
            this.selectedTabName = newTabName;
        },
        removeTab(targetName) {
            let tabs = this.editableTabs;
            let activeName = this.selectedTabName;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                });
            }

            this.selectedTabName = activeName;
            this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
    },
    mounted() {
        let that = this;
        ipcRenderer.on('window-resized', (event, bound) => {
            that.height = bound.height;
        })
    }
})