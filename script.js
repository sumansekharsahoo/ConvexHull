const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const points = [];

let st=0;

const drawLine=(px,py,nx,ny)=>{
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(nx, ny);
    ctx.stroke();
}

const drawDashedLine=(px,py,nx,ny)=>{
    ctx.beginPath();
    ctx.setLineDash([8, 6]);
    ctx.moveTo(px, py);
    ctx.lineTo(nx, ny);
    ctx.stroke();
}

const runHandler=()=>{
    for(let i=0;i<points.length-1;i++){
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2; 
        let px= points[i].x;
        let py= points[i].y;
        let nx= points[i+1].x;
        let ny= points[i+1].y;
        drawLine(px,py,nx,ny);
    }
}

const clearHandler=()=>{
    clearCanvas();
    while (points.length > 0) {
    points.pop();
    }
}

const runButton = document.getElementById("runBtn");
runButton.addEventListener("click", runHandler);

const clearButton = document.getElementById("clrBtn");
clearButton.addEventListener("click", clearHandler);

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    points.push({ x, y });
    // console.log(x,y);
    clearCanvas();
    drawPoints();
    // if(!st){
    //     st++;
    // }else{
    //     // let {xprev,yprev}=points[0]; 
    //     // drawLines(xprev,yprev,x,y);  
    //     // console.log(xprev,yprev);
    // }
});

const clearCanvas=()=> {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const drawPoints=()=> {
    ctx.beginPath();
    for (const { x, y } of points) {
        ctx.moveTo(x + 3, y);
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
    }
    ctx.fillStyle = 'black';
    ctx.fill();
}
