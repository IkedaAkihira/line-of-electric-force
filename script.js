class Electron {
    constructor(q, x, y) {
        this.x = x;
        this.y = y;
        this.q = q;
    }
}

function drawLineOfElectricForce(ctx, startElectron, endElectron, step = 10) {
    let electrons = [startElectron, endElectron];
    let x = startElectron.x;
    let y = startElectron.y;
    const startPositions = [];
    for (let i = 0; i <= Math.PI*2; i += Math.PI/16) {
        startPositions.push([x + 1 * Math.cos(i), y + 1 * Math.sin(i)]);
    }
    for (let pos of startPositions) {
        x = pos[0];
        y = pos[1];
        ctx.beginPath();
        ctx.moveTo(x, y);
        let count = 0;
        while (Math.hypot(x - endElectron.x, y - endElectron.y) > step && Math.hypot(x - endElectron.x, y - endElectron.y) < 1000) {// && count < 1000) {
            let force = getElectricForce(electrons, x, y);
            let r = Math.hypot(force[0], force[1]);
            x += force[0] / r * step;
            y += force[1] / r * step;
            ctx.lineTo(x, y);
            // console.log(force, x, y);
            count++;
        }
        ctx.stroke();

    }
    ctx.beginPath();
    ctx.arc(startElectron.x, startElectron.y, 10, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(endElectron.x, endElectron.y, 10, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
}

function getElectricForce(electrons, x, y) {
    let force = [0, 0];
    for (let electron of electrons) {
        let dx = x - electron.x;
        let dy = y - electron.y;
        let r = Math.hypot(dx, dy);
        let f = electron.q / (r * r);
        force[0] += f * dx / r;
        force[1] += f * dy / r;
    }
    return force;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.strokeStyle = "black";

drawLineOfElectricForce(ctx, new Electron(1, 50, 250), new Electron(-1, 450, 250));

onmousemove = function(e) {
    console.log(e.pageX, e.pageY);
    let x = e.pageX;
    let y = e.pageY;
    if (this.window.innerWidth < this.window.innerHeight) {
        x *= canvas.width / this.window.innerWidth;
        y *= canvas.height / this.window.innerWidth;
    } else {
        x *= canvas.width / this.window.innerHeight;
        y *= canvas.height / this.window.innerHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLineOfElectricForce(ctx, new Electron(1, x, y), new Electron(-1, 450, 250));
}

ontouchmove = function(e) {
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
    if (this.window.innerWidth < this.window.innerHeight) {
        x *= canvas.width / this.window.innerWidth;
        y *= canvas.height / this.window.innerWidth;
    } else {
        x *= canvas.width / this.window.innerHeight;
        y *= canvas.height / this.window.innerHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLineOfElectricForce(ctx, new Electron(1, x, y), new Electron(-1, 450, 250));
}