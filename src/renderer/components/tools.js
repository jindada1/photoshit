Vue.component("see", {
    props: {
        name: String,
        instance: Object,
    },
    template: '<p>Hello {{name}}</p>'
});

Vue.component("pen", {
    template: '\
    <div>\
        <el-divider content-position="center">颜色</el-divider>\
            <el-color-picker v-model="color" show-alpha :predefine="predefineColors" @change="colorSelected">\
            </el-color-picker>\
        <el-divider content-position="center">画笔粗细</el-divider>\
    </div>\
    ',
    props: {
        name: String,
        instance: Object
    },
    data() {
        return {
            pen: this.instance,
            color: '#000000',
            predefineColors: [
                '#ffffff',
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                '#000000',
                'rgba(255, 255, 255, 0)',
            ],
        }
    },
    methods: {
        colorSelected(color) {
            this.pen.set('strokeStyle', color);
        }
    }
});

Vue.component("cut", {
    props: {
        name: String,
        instance: Object,
    },
    template: '<p>Hello {{name}}</p>'
});