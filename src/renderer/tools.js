function Pen(config = null) {

    var isDown = false;
    var context = null;

    return {
        onBind: (ctx) => {
            // 线条的结束端点样式
            ctx.lineCap = "round";
            // 设置两条线相交时，所创建的拐角类型
            ctx.lineJion = "round";
            console.log('涂鸦模式');
            context = ctx;
        },
        onMouseDown: (x, y, ctx, e) => {
            isDown = true;
            // 起始/重置一条路径
            ctx.beginPath();
            // 把路径移动到画布中的指定点，不创建线条
            ctx.moveTo(x, y);
        },
        onMouseMove: (x, y, ctx, e) => {
            if (isDown) {
                // 添加一个新点，在画布中创建从该点到最后指定点的线条
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        },
        onMouseOut: (x, y, ctx, e) => {
            // 当鼠标移出画布区域时,创建从当前点回到起始点的路径
            ctx.closePath();
            isDown = false;
        },
        onMouseUp: (x, y, ctx, e) => {
            // 当鼠标移出画布区域时,创建从当前点回到起始点的路径
            ctx.closePath();
            isDown = false;
        }
    }
}