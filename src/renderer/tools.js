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

    return {
        set: (key, value) => {
            context[key] = value;
        },
        onBind: (ctx) => {
            console.log('涂鸦模式');
            context = ctx;
            // 线条的结束端点样式
            context.lineCap = "round";
            // 设置两条线相交时，所创建的拐角类型
            context.lineJion = "round";
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
            // 当鼠标移出画布区域时,创建从当前点回到起始点的路径
            context.closePath();
            isDown = false;
        }
    }
}

function Eraser(config = null) {

    var isDown = false;
    var context = null;

    return {
        onBind: (ctx) => {
            console.log('橡皮模式');
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

function See(config = null) {

    var isDown = false;
    var context = null;

    return {
        onBind: (ctx) => {
            console.log('查看模式');
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
            console.log('裁剪模式');
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