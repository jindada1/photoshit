Vue.component("see", {
    props: {
        name: String,
        instance: Object,
    },
    template: '<p>Hello {{name}}</p>',
    mounted() {
        console.log('see mounted')
    }
});

Vue.component("pen", {
    template: '\
    <div style="padding: 0 15px;">\
        <el-divider content-position="center">颜色</el-divider>\
        <div style="margin-right:-10px">\
            <div v-for="col in predefineColors" @click="colorSelected(col)" :style="{backgroundColor: col}" class="ps-color-picker-block"></div>\
        </div>\
        <div>\
            <span style="line-height: 40px;"> {{color}} </span>\
            <el-color-picker style="float: right" v-model="color" show-alpha @change="colorSelected"/>\
        </div>\
        <el-divider content-position="center">画笔粗细</el-divider>\
        <div :style="{lineHeight: maxLineWidth + \'px\'}">\
            <div class="ps-pen-dot-holder" :style="{width: maxLineWidth + \'px\', height: maxLineWidth + \'px\'}">\
                <div :style="{backgroundColor: color, width: lineWidth + \'px\', height: lineWidth + \'px\'}" class="ps-pen-dot"></div>\
            </div>\
            <span>{{lineWidth}}</span>\
        </div>\
        <el-slider v-model="lineWidth" :min="1" :max="maxLineWidth" @change="widthChanged"></el-slider>\
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
            lineWidth: 1,
            maxLineWidth: 40,
            predefineColors: [
                '#000000',
                '#ffffff',
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#00ff00',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
            ],
        }
    },
    methods: {
        colorSelected(color) {
            this.color = color;
            this.pen.set('strokeStyle', color);
        },
        widthChanged(width) {
            this.pen.set('lineWidth', width);
        }
    },
    mounted() {
        console.log('pen mounted')
    }
});

Vue.component("cut", {
    props: {
        name: String,
        instance: Object,
    },
    template: '<p>Hello {{name}}</p>'
});

Vue.component("eraser", {
    props: {
        name: String,
        instance: Object,
    },
    template: '<p>Hello {{name}}</p>'
});