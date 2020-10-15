Vue.component("see", {
    template: '\
    <div style="padding: 0 15px;">\
        <el-divider content-position="center">画布信息</el-divider>\
        <el-form :model="info" label-width="90px" class="ps-form-item-list">\
            <el-form-item label="图片宽度：">{{info.width}} px</el-form-item>\
            <el-form-item label="图片高度：">{{info.height}} px</el-form-item>\
            <el-form-item label="图片底色：">{{info.undercolor}}</el-form-item>\
        </el-form>\
    </div>\
    ',
    props: {
        name: String,
        instance: Object,
    },
    data() {
        return {
            canvas: this.instance,
            info: {
                width: 1,
                height: 2,
                undercolor: 'white'
            }
        }
    },
    mounted() {
        // console.log('see mounted');
        let self = this;
        // see 这个组件比 window 更先渲染，而 self.canvas 对象是在 window 渲染结束后才获取 context。
        Vue.nextTick(() => {
            // console.log('see get from See');
            self.info = self.canvas.info();
        })
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
            <span style="line-height: 40px; font-size: 14px;"> {{color}} </span>\
            <el-color-picker style="float: right" v-model="color" show-alpha @change="colorSelected"/>\
        </div>\
        <el-divider content-position="center">画笔粗细</el-divider>\
        <div :style="{lineHeight: maxLineWidth + \'px\'}">\
            <div class="ps-pen-dot-holder" :style="{width: maxLineWidth + \'px\', height: maxLineWidth + \'px\'}">\
                <div :style="{backgroundColor: color, width: lineWidth + \'px\', height: lineWidth + \'px\'}" class="ps-pen-dot"></div>\
            </div>\
            <span style="font-size: 14px;">{{lineWidth}}</span>\
        </div>\
        <el-slider v-model="lineWidth" :min="1" :max="maxLineWidth" @change="widthChanged"></el-slider>\
        <el-divider content-position="center">美化</el-divider>\
        <el-switch v-model="smoothLine"  disabled active-text="曲线平滑"></el-switch>\
        <el-switch v-model="shapeDetect" disabled active-text="形状识别"></el-switch>\
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
            smoothLine: false,
            shapeDetect: false,
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

Vue.component("adjust", {
    template: '\
    <div style="padding: 0 15px;">\
        <el-divider content-position="center">设置</el-divider>\
        <el-switch v-model="autoApply" disabled active-text="自动将调整应用到原图"></el-switch>\
        <el-divider content-position="center">参数调整</el-divider>\
        <div v-for="option in options" :key="option.name" >\
            <div style="margin-top:14px; font-size:14px; ">{{option.title}}\
                <span style="float:right">{{option.value}}</span>\
            </div>\
            <el-slider v-model="option.value" @input="change(option)"\
                :min="option.min" :max="option.max" :step="option.step"/>\
        </div>\
        <el-divider content-position="center">渲染顺序</el-divider>\
        <el-table :data="adjustments" style="width: 100%" :show-header="false">\
            <el-table-column type="index" width="40"> </el-table-column>\
            <el-table-column prop="title" label="参数" width="100"> </el-table-column>\
            <el-table-column prop="value" label="值"> </el-table-column>\
        </el-table>\
    </div>\
    ',
    props: {
        name: String,
        instance: Object,
    },
    data() {
        return {
            autoApply: true,
            adjuster: this.instance,
            options: [
                {
                    name: 'brightness',
                    value: 0,
                    max: 1,
                    min: -1,
                    step: 0.01,
                    title: '亮度',
                    origin: 0,
                },
                {
                    name: 'contrast',
                    value: 0,
                    max: 1,
                    min: -1,
                    step: 0.01,
                    title: '对比度',
                    origin: 0,
                },
                {
                    name: 'opacity',
                    value: 1,
                    max: 1,
                    min: 0,
                    step: 0.01,
                    title: '透明度',
                    origin: 1,
                },
                {
                    name: 'blur',
                    value: 0,
                    max: 20,
                    min: 0,
                    step: 1,
                    title: '模糊',
                    origin: 0,
                }
            ],
            adjustments: [],
        }
    },
    methods: {
        change(option) {
            this.orderAppend(option);
            // console.log(this.adjustments);
            this.adjuster.adjust(this.adjustments);
        },
        orderAppend(option) {

            let index = this.adjustments.findIndex(op => op.name === option.name);

            if (index > -1) this.adjustments.splice(index, 1);

            if (option.value === option.origin) return;

            this.adjustments.push({
                name: option.name,
                value: option.value,
                title: option.title,
            });
        },
        onShow() {
            for (const option of this.options) {
                option.value = option.origin;
            }
        }
    },
    mounted() {
        // console.log('adjust mounted');
        this.adjuster.setAutoApply(this.autoApply);
        this.adjuster.addbindEvent(this.onShow);
    }
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
                    <el-radio @change="modeSelected" v-model="eraserMode" :disabled="!mode.ok" :label="mode.name" border>{{mode.title}}</el-radio>\
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
                    tip: "用底色覆盖",
                    title: "普通橡皮",
                    ok: true
                },
                {
                    name: "super",
                    tip: "擦过的地方变透明",
                    title: "强力橡皮",
                    ok: true
                },
                {
                    name: "dot",
                    tip: "去除擦过地方的斑点",
                    title: "斑点橡皮",
                    ok: false
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

Vue.component("ps-filter", {
    props: {
        name: String,
        instance: Object,
    },
    template: '\
    <div style="padding: 0 15px; font-size:14px;">\
        <el-divider content-position="center">效果预览</el-divider>\
        <div style="margin-right: -5px">\
            <div v-for="filter in filters" :key="filter.title" class="ps-img-card" @click="filterClicked(filter)">\
                <div style="margin: 6px">\
                    <img :style="{filter: filter.value}" :src="imgsrc">\
                </div>\
                <div style="margin: 6px; text-align:center">{{filter.title}}</div>\
            </div>\
        </div>\
    </div>\
    ',
    data() {
        return {
            filter: this.instance,
            imgsrc: "https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png",
            filters: [
                {
                    title: '原图',
                    value: 'none',
                    method: 'origin',
                },
                {
                    title: '复古',
                    value: 'sepia(1)',
                    method: 'sepia',
                },
                {
                    title: '灰度',
                    value: 'grayscale(1)',
                    method: 'grayscale',
                },
                {
                    title: '鲜艳',
                    value: 'contrast(2);',
                    method: 'contrast',
                },
            ]
        }
    },
    methods: {
        filterClicked(effect) {
            this.filter.use(effect.method)
        },
        onShow(ctx) {
            this.imgsrc = ctx.canvas.toDataURL("image/jpg");
        }
    },
    mounted() {
        // console.log('filters mounted');
        this.filter.addbindEvent(this.onShow);
    }
});
