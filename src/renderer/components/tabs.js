const ipcRenderer = require('electron').ipcRenderer

// tabs窗口
Vue.component('ps-tabs', {
    template: '\
        <el-tabs v-model="selectedTabName" type="card" @tab-remove="removeTab" @tab-click="tabClicked">\
        <el-tab-pane :style="{height: paneHeight}" v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name" closable>\
            <ps-window/>\
        </el-tab-pane>\
        <el-tab-pane label="+" name="add"/>\
    </el-tabs>\
    ',
    data() {
        return {
            selectedTabName: '2',
            editableTabs: [{
                title: 'Tab 1',
                name: '1',
                content: 'Tab 1 content'
            }, {
                title: 'Tab 2',
                name: '2',
                content: 'Tab 2 content'
            }],
            tabIndex: 2,
            height: document.body.clientHeight
        }
    },
    computed : {
        paneHeight: function () {
            return (this.height - 56) + 'px';
        }
    },
    methods: {
        tabClicked(tab) {
            if (tab.name === 'add')
                this.addTab();
        },
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            this.editableTabs.push({
                title: 'New Tab',
                name: newTabName,
                content: 'New Tab content'
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