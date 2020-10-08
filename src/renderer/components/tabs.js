
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
            height: document.body.clientHeight
        }
    },
    computed: {
        paneHeight: function () {
            return (this.height - 56) + 'px';
        }
    },
    methods: {
        tabClicked(tab) {
            if (tab.name === 'add')
                this.createNew();
        },
        createNew() {
            ipcRenderer.send('add');
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
        
        ipcRenderer.on('window-resized', (event, bound) => {
            this.height = bound.height;
        })
        
        ipcRenderer.on('add-canvas', (event, arg) => {
            console.log(arg);
        })
        
    }
})