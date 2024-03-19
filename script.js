const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const points = [];
// const ints = [];

let st=0;
let ct=0;

const handleClick=()=>{
    for(let i=0;i<points.length;i++){
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2; 
        let {px,py}= points[i];
        let {nx,ny}= points[i];
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(nx, ny);
        ctx.stroke();
    }
}

const button = document.getElementById("runBtn");
button.addEventListener("click", handleClick);

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    points.push({ x, y });
    ints.push(ct);
    ct++;
    console.log(x,y);
    // clearCanvas();
    drawPoints();
    if(!st){
        st++;
    }else{
        // let {xprev,yprev}=points[0]; 
        // drawLines(xprev,yprev,x,y);  
        // console.log(xprev,yprev);
    }
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
    ctx.fillStyle = 'red';
    ctx.fill();
}

const drawLines=(x1,y1,x2,y2)=>{
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}
