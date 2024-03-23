const jmSVGMap = new Map();
const jmPoints=[];
const jlines=new Map();
const jHull=[];
const jActions=[];

const kpsSVGpoints = [];
const kpsPoints=[];
const kpslines=[]
const kpsHull=[];

const jmcont = document.getElementById('jarvisMarch');
const jarvisContainer = SVG()
  .addTo('#jarvisMarch')
  .size(700, 500)
  .viewbox(0, 0, 700, 500)
  .on('click', (event) => {
    const crect = jmcont.getBoundingClientRect();
    const point = jarvisContainer.circle(5)
      .center(event.clientX-crect.left, event.clientY-crect.top)
      .fill('#000');
      let pt= new Point(event.clientX-crect.left, event.clientY-crect.top);
      jmPoints.push(pt);
      jmSVGMap.set(pt,point); //
  });

const kpscont = document.getElementById('kirkPS');
const kpsContainer = SVG()
  .addTo('#kirkPS')
  .size(700, 500)
  .viewbox(0, 0, 700, 500)
  .on('click', (event) => {
    const crect = kpscont.getBoundingClientRect();
    const point = kpsContainer.circle(5)
      .center(event.clientX-crect.left, event.clientY-crect.top)
      .fill('#000');
    kpsSVGpoints.push(point);
    let pt= new Point(event.clientX-crect.left, event.clientY-crect.top);
    kpsPoints.push(pt);
  });

function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    
};
function shallowEqualityCheck(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }
  

function findAngle(prev_o,o,p) {
    let dAx = o.x - prev_o.x;
    let dAy = o.y - prev_o.y;
    let dBx = p.x - o.x;
    let dBy = p.y - o.y;
    let angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
    let degree_angle = angle * (180 / Math.PI);
    degree_angle=degree_angle+180
    return degree_angle
}
function findNextOrigin(prev_o,o,points,action){
    let flag=0;
    let best_angle = 360
    let best_point = null
    // console.log(o)
    for (let i = 0; i < points.length; i++){
        if(JSON.stringify(points[i]) === JSON.stringify(o) || JSON.stringify(points[i]) === JSON.stringify(prev_o)){
            continue
        }
        let angle=findAngle(prev_o,o,points[i])
        if(angle < best_angle){
          // drawCandLine(jarvisContainer,o,points[i]);
          if(flag===0){
            action.push(["asl",o,points[i]]);
            flag++;
          }else{
            action.push(["adl",o,points[i]]);
            action.push(["rsl"]);
            action.push(["asl",o,points[i]]);

          }

            best_angle = angle
            best_point = JSON.parse(JSON.stringify(points[i]));
            // console.log(best_point)
            // markCandPoint(best_point);
        }
        else if(angle == best_angle){
            if(Math.hypot(o.x-best_point.x, o.y-best_point.y)>Math.hypot(o.x-points[i].x, o.y-points[i].y)){
                best_angle = angle
                best_point = JSON.parse(JSON.stringify(points[i]));
            }
        }
        else{
          action.push(["adl",o,points[i]]);
          action.push(["rdl"]);
        }
        
    }
    // markHullPoint(best_point);
    // drawHullLine(jarvisContainer,o,best_point)
    return best_point

}
function Jarvis(points, svgmap, lines, hullpoints, action){
    let hull = []
    let i=0;
    let origin=new Point(Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER)
    for (i = 0; i < points.length; i++){
        if(origin.y > points[i].y){
            origin = JSON.parse(JSON.stringify(points[i]));
        }
    }
    action.push(["ccb",origin]);
    prev_o = JSON.parse(JSON.stringify(origin));  
    prev_o.x = prev_o.x+0.001
    // console.log(origin)
    hull.push(origin);
    hullpoints.push(origin);
    // markHullPoint(origin);
    while(true){
      let candidate  = findNextOrigin(prev_o,origin,points,action);
      action.push(["ccg",origin]);
      // markCandPoint(candidate)
      if(hull.some((item) => shallowEqualityCheck(item, candidate))){
        // markHullPoint(candidate);
        action.push(["ccg",candidate]);
        
        break
      }
      else{
        action.push(["ccb",candidate]);

      }
      hull.push(candidate)
      hullpoints.push(candidate)
        prev_o = JSON.parse(JSON.stringify(origin));
        origin = JSON.parse(JSON.stringify(candidate));
        // markCurPoint(origin);
    }
    return hull
}

const solidLine=[]
const dotLine=[]
document.getElementById('jmRun').addEventListener('click', () => {
  Jarvis(jmPoints,jmSVGMap,jlines,jHull, jActions)
  document.getElementById("jmRun").disabled = true;
  // console.log(jActions);
  performActions(jActions,solidLine,dotLine,600);
});

document.getElementById('jmRand').addEventListener('click', () => {
  const noPoints = getRandomNumber(8, 18);
  for(let i=0;i<noPoints;i++){
    let rx=getRandomNumber(40,660);
    let ry= getRandomNumber(40,460)
    const point = jarvisContainer.circle(5)
    .center(rx,ry)
    .fill('#f06');
    let pt= new Point(rx,ry);
    jmSVGMap.set(pt,point);//
    jmPoints.push(pt);
  }
});

document.getElementById('jmClr').addEventListener('click', () => {
  document.getElementById("jmRun").disabled = false;

  jarvisContainer.clear();
  for (const [key, value] of jmSVGMap) {
    jmSVGMap.delete(key);
  }
  for (const [key, value] of jlines) {
    jlines.delete(key);
  }
  
  sz=jmPoints.length
  for(let i=0;i<sz;i++){
    jmPoints.pop();
  }
  sz=jHull.length
  for(let i=0;i<sz;i++){
    jHull.pop();
  }
  sz=jActions.length;
  for(let i=0;i<sz;i++){
    jActions.pop();
  }
  sz= solidLine.length
  for(let i=0;i<sz;i++){
    solidLine.pop();
  }
  sz= dotLine.length
  for(let i=0;i<sz;i++){
    dotLine.pop();
  }

});


function performActions(actionArray, solidLine,dotLine, delay) {
  if (actionArray.length === 0) return; 
  const action = actionArray.shift();
  console.log(action);
  if(action[0]==="ccb"){
    markCurPoint(action[1]);
  }
  else if(action[0]==="ccg"){
    markHullPoint(action[1]);
  }
  else if(action[0]==="asl"){
    const line = jarvisContainer.line(action[1].x, action[1].y, action[2].x, action[2].y)
          .stroke({ width: 3, color: '#f06' })
    solidLine.push(line);
    // console.log(solidLine)
  }
  else if(action[0]==="rsl"){
    const deline= solidLine.pop();
    deline.remove();
  }
  else if(action[0]==="adl"){
    const line = jarvisContainer.line(action[1].x, action[1].y, action[2].x, action[2].y)
          .stroke({ width: 2, color: '#337357' })
          .attr('stroke-dasharray', '10,5');
    dotLine.push(line);
    // console.log(dotLine)
  }
  else if(action[0]==="rdl"){
    let deline= dotLine.pop();
    deline.remove();
    while(dotLine.length!==0){
      deline= dotLine.pop();
      deline.remove();
    }
  }
  // console.log(action);
  setTimeout(() => performActions(actionArray,solidLine,dotLine, delay), delay);
}

const markHullPoint=(point)=>{
  jarvisContainer.circle(10)
      .center(point.x,point.y)
      .fill('#4CE45C');
}

const markCandPoint=(point)=>{
  jarvisContainer.circle(8)
      .center(point.x,point.y)
      .fill('#f06');
}

const markCurPoint=(point)=>{
  jarvisContainer.circle(10)
      .center(point.x,point.y)
      .fill('#0943F4');
}

const getRandomNumber=(min, max)=> {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}