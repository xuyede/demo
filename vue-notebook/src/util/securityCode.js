function getString () {
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 65; i < 122; i++) {
        if (i > 90 && i < 97) {
            continue;
        }
        // 接受一个指定的 Unicode 值，然后返回一个字符串
        arr.push(String.fromCharCode(i));
    }
    return arr
}
let arr = getString()

function createCanvas(canvasDom) {
    
    let canvasStr = '';
    let value = '';
    for (let i = 0; i < 4; i++) {
        let a = arr[Math.floor(Math.random() * arr.length)];
        canvasStr += a + ' ';
        value += a;
    }
    let canvas = canvasDom,
        ctx = canvas.getContext('2d'),
        x = canvas.width / 2,
        oImg = new Image();
    oImg.src = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546499466766&di=73fc67d67aca59134d186d3c5da83d99&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201503%2F21%2F20150321194517_rGLzz.jpeg';
    oImg.onload = function () {
        var pattern = ctx.createPattern(oImg, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ccc';
        ctx.font = '16px Roboto Slab';
        ctx.setTransform(1, -0.12, 0.2, 1, 0, 12);
        ctx.fillText(canvasStr, x, 20);
    }
    return value
}

export default createCanvas 