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

    return {
        // 控制组件初始化时把ui数据同步进来，此时未应用到公共 context 上
        config: (key, value)=>{
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
            for(var key in configuratins)
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
        onMouseOut: (x, y, ctx, e) => {
            // 当鼠标移出画布区域时,创建从当前点回到起始点的路径
            context.closePath();
            isDown = false;
        },
        onMouseUp: (x, y, ctx, e) => {
            // 当鼠标抬起时,创建从当前点回到起始点的路径
            context.closePath();
            isDown = false;
        }
    }
}

function Eraser(config = null) {

    var isDown = false;
    var context = null;
    var mode = null;
    var transparent = 'rgba(0,0,0,0)';
    var cache = {}

    var configuratins = {
        // 线条的结束端点样式
        lineCap: "round",
        // 设置两条线相交时，所创建的拐角类型
        lineJion: "round"
    }

    return {
        switchMode: (m) => {
            mode = m;
        },
        // 控制组件初始化时把ui数据同步进来，此时未应用到公共 context 上
        config: (key, value)=>{
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
            for(var key in configuratins)
                context[key] = configuratins[key];
        },
        onMouseDown: (x, y, ctx, e) => {
            isDown = true;
            // 起始/重置一条路径
            context.beginPath();
            // 把路径移动到画布中的指定点，不创建线条
            context.moveTo(x, y);
            
            if (mode === "super" || context.psUnderColor === transparent) {
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
        onMouseOut: (x, y, ctx, e) => {
            // 当鼠标移出画布区域时,创建从当前点回到起始点的路径
            context.closePath();
            isDown = false;
            if (mode === "super" || context.psUnderColor === transparent) {
                context.globalCompositeOperation = cache['globalCompositeOperation']
                context.strokeStyle = cache['strokeStyle']
            }
        },
        onMouseUp: (x, y, ctx, e) => {
            // 当鼠标抬起时,创建从当前点回到起始点的路径
            context.closePath();
            isDown = false;
            if (mode === "super" || context.psUnderColor === transparent) {
                context.globalCompositeOperation = cache['globalCompositeOperation']
                context.strokeStyle = cache['strokeStyle']
            }
        }
    }
}

function See(config = null) {

    var isDown = false;
    var context = null;

    return {
        info: ()=>{
            return {
                width: context.canvas.width,
                height: context.canvas.height,
                undercolor: context.psUnderColor
            }
        },
        onBind: (ctx) => {
            console.log('绑定 See');
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