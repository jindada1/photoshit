// context = {
//     globalAlpha: 1,
//     globalCompositeOperation: "source-over",
//     filter: "none",
//     imageSmoothingEnabled: true,
//     imageSmoothingQuality: "low",
//     strokeStyle: "#000000",
//     fillStyle: "#000000",
//     shadowOffsetX: 0,
//     shadowOffsetY: 0,
//     shadowBlur: 0,
//     shadowColor: "rgba(0, 0, 0, 0)",
//     lineWidth: 1,
//     lineCap: "round",
//     lineJoin: "miter",
//     miterLimit: 10,
//     lineDashOffset: 0,
//     font: "10px sans-serif",
//     textAlign: "start",
//     textBaseline: "alphabetic",
//     direction: "ltr",
//     lineJion: "round"
// } 


function Pen(config = null) {

    var isDown = false;
    var context = null;

    var configuratins = {
        // 线条的结束端点样式
        lineCap: "round",
        // 设置两条线相交时，所创建的拐角类型
        lineJion: "round",
    }

    function finish(x, y, ctx, e) {
        context.closePath();
        isDown = false;
    }

    return {
        // 控制组件初始化时把ui数据同步进来，此时未应用到公共 context 上
        config: (key, value) => {
            configuratins[key] = value;
        },
        set: (key, value) => {
            context[key] = value;
            configuratins[key] = value;
        },
        onBind: (ctx) => {
            // console.log('涂鸦模式');
            context = ctx;

            // 将之前保存的配置应用于 context
            for (var key in configuratins)
                context[key] = configuratins[key];
        },
        onMouseDown: (x, y, ctx, e) => {
            isDown = true;
            // 起始/重置一条路径
            context.beginPath();
            // 把路径移动到画布中的指定点，不创建线条
            context.moveTo(x, y);
        },
        onMouseMove: (x, y, ctx, e) => {
            if (isDown) {
                // 添加一个新点，在画布中创建从该点到最后指定点的线条
                context.lineTo(x, y);
                context.stroke();
            }
        },
        onMouseOut: finish,
        onMouseUp: finish
    }
}

function Eraser(config = null) {

    var isDown = false;
    var context = null;
    var mode = null;
    // var transparent = 'rgba(0,0,0,0)';
    var cache = {}

    var configuratins = {
        // 线条的结束端点样式
        lineCap: "round",
        // 设置两条线相交时，所创建的拐角类型
        lineJion: "round"
    }

    function finish(x, y, ctx, e) {
        context.closePath();
        isDown = false;
        if (mode === "super" || context.psUnderColor === psData.transparent) {
            context.globalCompositeOperation = cache['globalCompositeOperation']
            context.strokeStyle = cache['strokeStyle']
        }
    }

    return {
        switchMode: (m) => {
            mode = m;
        },
        // 控制组件初始化时把ui数据同步进来，此时未应用到公共 context 上
        config: (key, value) => {
            configuratins[key] = value;
        },
        // 控制组件运行时调整参数
        set: (key, value) => {
            context[key] = value;
            configuratins[key] = value;
        },
        // 绑定事件时，即切换模式的时候
        onBind: (ctx) => {
            // console.log('橡皮模式');
            context = ctx;
            // 设置橡皮颜色
            configuratins['strokeStyle'] = ctx['psUnderColor'];
            // 将之前保存的配置应用于 context
            for (var key in configuratins)
                context[key] = configuratins[key];
        },
        onMouseDown: (x, y, ctx, e) => {
            isDown = true;
            // 起始/重置一条路径
            context.beginPath();
            // 把路径移动到画布中的指定点，不创建线条
            context.moveTo(x, y);

            if (mode === "super" || context.psUnderColor === psData.transparent) {
                // console.log(context);
                cache['globalCompositeOperation'] = context.globalCompositeOperation;
                cache['strokeStyle'] = context.strokeStyle;
                context.globalCompositeOperation = 'destination-out';
                context.strokeStyle = '#ffffff';
            }
        },
        onMouseMove: (x, y, ctx, e) => {
            if (isDown) {
                // 添加一个新点，在画布中创建从该点到最后指定点的线条
                context.lineTo(x, y);
                context.stroke();
            }
        },
        onMouseOut: finish,
        onMouseUp: finish
    }
}

function See(config = null) {

    var isDown = false;
    var context = null;

    return {
        info: () => {
            return {
                width: context.canvas.width,
                height: context.canvas.height,
                undercolor: context.psUnderColor
            }
        },
        onBind: (ctx) => {
            context = ctx;
            console.log('See bind with context')
        },
        onMouseDown: (x, y, ctx, e) => {
            isDown = true;
        },
        onMouseMove: (x, y, ctx, e) => {
            if (isDown) {

            }
        },
        onMouseOut: (x, y, ctx, e) => {

            isDown = false;
        },
        onMouseUp: (x, y, ctx, e) => {

            isDown = false;
        }
    }
}

function Cut(config = null) {

    var isDown = false;
    var context = null;

    return {
        onBind: (ctx) => {
            // console.log('裁剪模式');
            context = ctx;
        },
        onMouseDown: (x, y, ctx, e) => {
            isDown = true;
        },
        onMouseMove: (x, y, ctx, e) => {
            if (isDown) {

            }
        },
        onMouseOut: (x, y, ctx, e) => {

            isDown = false;
        },
        onMouseUp: (x, y, ctx, e) => {

            isDown = false;
        }
    }
}

function Filter(config = null) {

    var context = null;
    var imgdata = null;
    let onbindcb = null;

    function render(image) {
        const imageData = new ImageData(
            Uint8ClampedArray.from(image.bitmap.data),
            image.bitmap.width,
            image.bitmap.height
        );
        context.putImageData(imageData, 0, 0);
    }

    var filters = {
        origin: () => {
            var data = imgdata.data;
            for (var i = 0; i < data.length; i++) {
                data[i] = origin[i]
            }
            context.putImageData(imgdata, 0, 0);
        },
        sepia: () => {
            for (var i = 0; i < imgdata.height * imgdata.width; i++) {
                var r = origin[i * 4],
                    g = origin[i * 4 + 1],
                    b = origin[i * 4 + 2];

                var newR = 0.393 * r + 0.769 * g + 0.189 * b;
                var newG = 0.349 * r + 0.686 * g + 0.168 * b;
                var newB = 0.272 * r + 0.534 * g + 0.131 * b;
                var rgbArr = [newR, newG, newB].map(e => {
                    return e < 0 ? 0 : e > 255 ? 255 : e;
                });
                [imgdata.data[i * 4], imgdata.data[i * 4 + 1], imgdata.data[i * 4 + 2]] = rgbArr;
            }
            context.putImageData(imgdata, 0, 0);
        },
        contrast: () => {
            Jimp.read(imgdata, (err, image) => {
                if (err) throw err;
                image.contrast(0.2);
                render(image)
            });
        },
        grayscale: () => {
            var data = imgdata.data;
            for (var i = 0; i < data.length; i += 4) {
                var grey = (origin[i] + origin[i + 1] + origin[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = grey;
                data[i + 3] = origin[i + 3]
            }
            context.putImageData(imgdata, 0, 0);
        }
    }

    return {
        addbindEvent(callback) {
            onbindcb = callback;
        },
        onBind: (ctx) => {
            // console.log('裁剪模式');
            context = ctx;
            imgdata = context.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            origin = [...imgdata.data];  // 原始数据存下来
            if (onbindcb) onbindcb(context);
        },
        use: (effect) => {
            if (!imgdata) return;
            filters[effect]();
        }
    }
}

function Adjust(config = null) {

    var context = null;
    var autoApply = false;
    var img = false;

    function render(image) {
        const imageData = new ImageData(
            Uint8ClampedArray.from(image.bitmap.data),
            image.bitmap.width,
            image.bitmap.height
        );
        context.putImageData(imageData, 0, 0);
    }

    let onbindcb = null;

    return {
        addbindEvent(callback) {
            onbindcb = callback;
        },
        setAutoApply: (value) => {
            autoApply = value;
        },
        onBind: (ctx) => {
            context = ctx;
            img = context.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            if (onbindcb) onbindcb();
        },
        adjust: (options) => {

            if (!img) return;

            Jimp.read(img, (err, image) => {
                if (err) throw err;
                for (let index in options) {
                    image[options[index].name](options[index].value);
                }

                render(image)
            });
        }
    }
}