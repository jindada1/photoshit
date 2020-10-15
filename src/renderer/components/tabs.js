
// tabs窗口
Vue.component('ps-tabs', {
    template: '\
        <div>\
            <el-tabs v-model="selectedTabName" type="border-card" @tab-remove="removeTab" @tab-click="tabClicked">\
                <el-tab-pane :style="{height: paneHeight}" v-for="(item, index) in editableTabs" :key="item.name"\
                    :label="item.title" :name="item.name" closable>\
                    <ps-window :meta-data="item.meta" :index="item.name"/>\
                </el-tab-pane>\
                <el-tab-pane :style="{height: paneHeight}" label=" ＋ " name="add">\
                    <ps-home/>\
                </el-tab-pane>\
            </el-tabs>\
        </div>\
    ',
    data() {
        return {
            selectedTabName: 'add',
            tabIndex: 0,
            editableTabs: [],
            height: document.body.clientHeight
        }
    },
    computed: {
        paneHeight: function () {
            return (this.height - 36) + 'px';
        }
    },
    methods: {
        tabClicked(tab) {
            if (tab.name === 'add') ipcRenderer.send('add');
        },
        addTab(meta) {
            let newTabName = ++this.tabIndex + '';
            this.editableTabs.push({
                title: 'Untitled-' + newTabName,
                name: newTabName,
                meta: meta
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
        // console.log('tabs mounted');
        
        ipcRenderer.on('window-resized', (event, bound) => {
            this.height = bound.height;
        })
        
        ipcRenderer.on('add-canvas', (event, arg) => {
            this.addTab(arg);
        })
        
    }
})