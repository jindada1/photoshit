

// 图片编辑窗口
Vue.component('ps-home', {
    template: '\
        <div style="height:100%">\
            <div style="text-align: center;">\
                <div style="font-size: 32px; font-weight: bold; padding: 44px 0;">欢迎使用</div>\
                <el-button @click="create" type="primary" style="font-size: 20px; padding: 16px 24px;">新 建 项 目</el-button>\
            </div>\
        </div>\
        ',
    data() {
        return {
        }
    },
    props: {
    },
    methods: {
        create() {
            ipcRenderer.send('open-create-window');
        }
    },
    mounted() {
        // console.log('window mounted');
    }
})