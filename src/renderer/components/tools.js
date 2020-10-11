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
            color: '#00ff00',
            lineWidth: 3,
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
        // console.log('pen mounted');
        this.pen.config('strokeStyle', this.color);
        this.pen.config('lineWidth', this.lineWidth);
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
    template: '\
    <div style="padding: 0 15px;">\
        <el-divider content-position="center">橡皮大小</el-divider>\
        <div :style="{lineHeight: maxSize + \'px\'}">\
            <div class="ps-eraser-dot-holder" :style="{width: maxSize + \'px\', height: maxSize + \'px\'}">\
                <div :style="{width: size + \'px\', height: size + \'px\'}" class="ps-eraser-dot"></div>\
            </div>\
        </div>\
        <el-slider v-model="size" :min="1" :max="maxSize" @change="sizeChanged"></el-slider>\
        <el-divider content-position="center">橡皮类型</el-divider>\
        <div class="ps-options">\
            <div v-for="mode in modes" :key="mode.name">\
                <el-tooltip :content="mode.tip" effect="dark" placement="left">\
                    <el-radio @change="modeSelected" v-model="eraserMode" :label="mode.name" border>{{mode.title}}</el-radio>\
                </el-tooltip>\
            </div>\
        </div>\
    </div>\
    ',
    data() {
        return {
            eraser: this.instance,
            size: 10,
            maxSize: 100,
            modes: [
                {
                    name: "normal",
                    tip: "擦过的地方保留底色",
                    title: "普通橡皮",
                },
                {
                    name: "super",
                    tip: "擦过的地方变透明",
                    title: "强力橡皮",
                },
                {
                    name: "dot",
                    tip: "去除擦过地方的斑点",
                    title: "斑点橡皮",
                },
            ],
            eraserMode: 'normal',
        }
    },
    methods: {
        sizeChanged(size) {
            this.eraser.set('lineWidth', size);
        },
        modeSelected(mode) {
            this.eraser.switchMode(mode);
        }
    },
    mounted() {
        // console.log('eraser mounted');
        this.eraser.config('lineWidth', this.size);
        this.eraser.switchMode(this.eraserMode);
    }
});