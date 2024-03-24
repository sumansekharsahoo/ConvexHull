//global vars
const jmSVGMap = new Map();
const jmPoints=[];
const jHull=[];
const jActions=[];

const kpsSVGMap = new Map();
const kpsPoints=[];
const kpsHull=[];
const kpsActions=[];

const getRandomNumber=(min, max)=> {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//svg containers
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
    let pt= [event.clientX-crect.left, event.clientY-crect.top];
    kpsPoints.push(pt);
    kpsSVGMap.set(pt,point);
  });

//jarvis March functions
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
            action.push(["rdl"]);
          }

            best_angle = angle
            best_point = JSON.parse(JSON.stringify(points[i]));
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
    return best_point

}
function Jarvis(points, svgmap, hullpoints, action){
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

const markHullPoint=(point)=>{
  const gp=jarvisContainer.circle(10)
      .center(point.x,point.y)
      .fill('#4CE45C');
  return gp;
}

const markCurPoint=(point)=>{
  const bp=jarvisContainer.circle(10)
      .center(point.x,point.y)
      .fill('#0943F4');
  return bp;
}

//jarvis March buttons
const solidLine=[]
const dotLine=[]
const circles=[]
document.getElementById('jmRun').addEventListener('click', () => {
  Jarvis(jmPoints,jmSVGMap,jHull, jActions)
  document.getElementById("jmRun").disabled = true;
  // console.log(jActions);
  performActions(jActions,solidLine,dotLine,circles,600);
});

document.getElementById('jmRand').addEventListener('click', () => {
  const noPoints = getRandomNumber(8, 18);
  for(let i=0;i<noPoints;i++){
    let rx=getRandomNumber(40,660);
    let ry= getRandomNumber(40,460)
    const point = jarvisContainer.circle(5)
    .center(rx,ry)
    .fill('#000');
    let pt= new Point(rx,ry);
    jmSVGMap.set(pt,[point]);//
    jmPoints.push(pt);
  }
});

document.getElementById('jmClr').addEventListener('click', () => {
  document.getElementById("jmRun").disabled = false;

  jarvisContainer.clear();
  for (const [key, value] of jmSVGMap) {
    jmSVGMap.delete(key);
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

document.getElementById('jmLClr').addEventListener('click', () => {
  document.getElementById("jmRun").disabled = false;
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
    let ps= solidLine.pop();
    ps.remove();
  }
  sz= dotLine.length
  for(let i=0;i<sz;i++){
    let ps=dotLine.pop();
    ps.remove();
  }
  sz= circles.length
  for(let i=0;i<sz;i++){
    let ps=circles.pop();
    ps.remove();
  }
  Jarvis(jmPoints,jmSVGMap,jHull, jActions)
  document.getElementById("jmRun").disabled = true;
  // console.log(jActions);
  performActions(jActions,solidLine,dotLine,circles,600);
});

//jarvis March actions runner
function performActions(actionArray, solidLine,dotLine, circles, delay) {
  if (actionArray.length === 0) return; 
  const action = actionArray.shift();
  console.log(action);
  if(action[0]==="ccb"){
    circles.push(markCurPoint(action[1]));
  }
  else if(action[0]==="ccg"){
    circles.push(markHullPoint(action[1]));
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
    while(dotLine.length!==0){
      deline= dotLine.pop();
      deline.remove();
    }
  }
  // console.log(action);
  setTimeout(() => performActions(actionArray,solidLine,dotLine, circles, delay), delay);
}




//kps funtions

function flipped(points) {
    return points.map(point => [-point[0], -point[1]]);
}

function flipval(point){
  return [-point[0],-point[1]];
}

function printMat(points) {
    for (let point of points) {
        let x = point[0], y = point[1]
        console.log(x + " " + y)
    }
}

function integerDivision(dividend, divisor) {
    return Math.floor(dividend / divisor);
}

function popFromSet(set) {
    const iterator = set.values();
    const first = iterator.next().value;
    set.delete(first);
    return first;
}

function quickselect(points, k) {
    let sortedPoints = points.sort((a, b) => {
        if (a[0] !== b[0])
            return a[0] - b[0]
        else
            return a[1] - b[1]
    })
    return sortedPoints[k]
}

function getBridge(points, median) {
    // console.log(median)
    // console.log(points)
    let candidates = new Set()
    if (points.length === 2) {
        sortedPoints = points.sort((a, b) => {
            if (a[0] !== b[0])
                return a[0] - b[0]
            else
                return a[1] - b[1]
        })
        return sortedPoints
    }

    let pairs = []
    let points_set = new Set(points)
    // console.log("Set: ", points_set)

    while (points_set.size >= 2) {
        let pair = [];
        pair.push(popFromSet(points_set))
        pair.push(popFromSet(points_set))
        pair = pair.sort((a, b) => {
            if (a[0] !== b[0])
                return a[0] - b[0]
            else
                return a[1] - b[1]
        })
        pairs.push(pair)
    }
    // console.log("PAIRS :", pairs)

    if (points_set.size === 1)
        candidates.add(popFromSet(points_set));
    let slopes = []
    for (let i = 0; i < pairs.length; i++) {
        let p1 = pairs[i][0]
        let p2 = pairs[i][1]
        if (p1[0] === p2[0]) {
            if (p1[1] > p2[1])
                candidates.add(p1)
            else
                candidates.add(p2)
            pairs.splice(i, 1)
            i--
        } 
        else {
            let slope = (p1[1] - p2[1]) / (p1[0] - p2[0])
            slopes.push(slope)
        }
    }

    let med_index = Math.floor(slopes.length / 2) - (slopes.length % 2 === 0 ? 1 : 0);
    let med_slope = quickselect(slopes, med_index)
    let small = [], equal = [], large = []

    for (let i in slopes) {
        if (slopes[i] < med_slope)
            small.push(pairs[i])
        else if (slopes[i] > med_slope)
            large.push(pairs[i])
        else
            equal.push(pairs[i])
    }

    let max_intercept = -Infinity
    for (let point of points)
        if (max_intercept < point[1] - med_slope * point[0])
            max_intercept = point[1] - med_slope * point[0]
    
    let max_set = new Set()
    for (let point of points) {
        if (max_intercept === point[1] - med_slope * point[0]) {
            max_set.add(point)
        }
    }

    // console.log(max_intercept)
    max_set = Array.from(max_set);

    let left = max_set[0];
    for (let i = 1; i < max_set.length; i++)
        if ((max_set[i][0] < left[0]) || (max_set[i][0] === left[0] && max_set[i][1] < left[1]))
            left = max_set[i]

    let right = max_set[0];
    for (let i = 1; i < max_set.length; i++)
        if ((max_set[i][0] > right[0]) || (max_set[i][0] === right[0] && max_set[i][1] > right[1]))
            right = max_set[i]
    
    // console.log(left)
    // console.log(right)
    

    if (left[0] <= median && right[0] >= median)
        return [left, right]

    if (right[0] <= median) {
        let largeEqual = new Set([...large, ...equal]);
        for (let [_, point] of largeEqual) {
            candidates.add(point);
        }

        for (let pair of small) {
            for (let point of pair) {
                candidates.add(point);
            }
        }
    }

    if (left[0] > median) {
        let smallEqual = new Set([...small, ...equal]);
        for (let [point, _] of smallEqual) {
            candidates.add(point);
        }

        for (let pair of large) {
            for (let point of pair) {
                candidates.add(point);
            }
        }
    }

    candidates = Array.from(candidates)
    // console.log("Candidates: ", candidates)
    // console.log()
    
    return getBridge(candidates, median)
}

function connect(p1, p2, points, actions,flp) {
    if (p1 === p2){
      if(flp){
        actions.push(["kagp",flipval(p1)]);
      }else{
        actions.push(["kagp",p1]);
      }
      return [p1]
    }
    let leftMax = quickselect(points, integerDivision(points.length, 2) - 1)
    let rightMin = quickselect(points, integerDivision(points.length, 2))
    if(flp){
      actions.push(["kmedx",(-leftMax[0] - rightMin[0]) / 2]);
    }else{
      actions.push(["kmedx",(leftMax[0]+rightMin[0])/2]);
    }
    let [left, right] = getBridge(points, (leftMax[0] + rightMin[0]) / 2)
    let small = new Set(), large = new Set()
    
    small.add(left);
    for (let point of points)
        if (point[0] < left[0])
            small.add(point);

    large.add(right);
    for (let point of points)
        if (point[0] > right[0])
            large.add(point);
    
    small = Array.from(small)
    large = Array.from(large)

    return connect(p1, left, small,actions).concat(connect(right, p2, large,actions))
}

function getUpperHull(points,actions,flp) {
    let leftMost = points[0], rightMost = points[0]
    for (let i = 1; i < points.length; i++) {
        if (points[i][0] < leftMost[0])
            leftMost = points[i]
    }
    for (let i = 0; i < points.length; i++) {
        if (points[i][0] === leftMost[0] && points[i][1] > leftMost[1])
            leftMost = points[i]
    }
    if(flp){
      actions.push(["kagp",flipval(leftMost)])
    }else{
      actions.push(["kagp",leftMost])
    }
    for (let i = 1; i < points.length; i++) {
        if (points[i][0] > rightMost[0])
            rightMost = points[i]
    }
    for (let i = 0; i < points.length; i++) {
        if (points[i][0] === rightMost[0] && points[i][1] > rightMost[1])
            rightMost = points[i]
    }
    if(flp){
      actions.push(["kagp",flipval(rightMost)])
    }else{
      actions.push(["kagp",rightMost])
    }
    let newPoints = []
    newPoints.push(leftMost)
    let maxy= Math.max(leftMost[1],rightMost[1]);
    let hidp=[]
    for (let point of points) {
        if (point[0] > leftMost[0] && point[0] < rightMost[0] && point[1]>=maxy){
          newPoints.push(point)
        }
    }
    newPoints.push(rightMost)
    const setNew= new Set(newPoints);
    for(const el of points){
      if(!setNew.has(el)){
        if(flp){
          hidp.push(el);
        }else{
          hidp.push(flipval(el));
        }
      }
    }
    actions.push(["hidp",hidp]);
    points = newPoints
    // console.log("After taking LR: ", points)

    return connect(leftMost, rightMost, points,actions, flp)

}

function convexHull(points,actions) {
    let upperHull = getUpperHull(points,actions,0);
    //unhide hidden
    actions.push(["uhid"])
    let flippedPoints = flipped(points);
    // console.log("Flipped Points: ", flippedPoints)
    let lowerHull = getUpperHull(flippedPoints,actions,1);
    lowerHull = flipped(lowerHull);

    // console.log(upperHull)
    // console.log(lowerHull)
    

    if (upperHull[upperHull.length - 1][0] === lowerHull[0][0] && upperHull[upperHull.length - 1][1] === lowerHull[0][1])
        upperHull.pop();
    if (upperHull[0][0] === lowerHull[lowerHull.length - 1][0] && upperHull[0][1] === lowerHull[lowerHull.length - 1][1])
        lowerHull.pop();

    return upperHull.concat(lowerHull);
}

const kpsMarkHull=(point)=>{
  const gp=kpsContainer.circle(10)
      .center(point[0],point[1])
      .fill('#4CE45C');
  return gp;
}

const kpsMarkHidden=(point)=>{
  const gp=kpsContainer.circle(5)
      .center(point[0],point[1])
      .fill('#8F8E91');
  return gp;
}

//kps buttons
const solidLine2=[]
const dotLine2=[]
document.getElementById('kpsRun').addEventListener('click', () => {
  convexHull(points,kpsActions)
  document.getElementById("kpsRun").disabled = true;
  
});

document.getElementById('kpsRand').addEventListener('click', () => {
  const noPoints = getRandomNumber(8, 18);
  for(let i=0;i<noPoints;i++){
    let rx=getRandomNumber(40,660);
    let ry= getRandomNumber(40,460)
    const point = kpsContainer.circle(5)
    .center(rx,ry)
    .fill('#000');
    let pt= new Point(rx,ry);
    kpsSVGMap.set(pt,point);//
    kpsPoints.push(pt);
  }
});

document.getElementById('kpsClr').addEventListener('click', () => {
  document.getElementById("kpsRun").disabled = false;

  kpsContainer.clear();
  for (const [key, value] of kpsSVGMap) {
    kpsSVGMap.delete(key);
  }
  for (const [key, value] of kpslines) {
    kpslines.delete(key);
  }
  
  sz=kpsPoints.length
  for(let i=0;i<sz;i++){
    kpsPoints.pop();
  }
  sz=kpsHull.length
  for(let i=0;i<sz;i++){
    kpsHull.pop();
  }
  sz=kpsActions.length;
  for(let i=0;i<sz;i++){
    kpsActions.pop();
  }
  sz= solidLine2.length
  for(let i=0;i<sz;i++){
    solidLine2.pop();
  }
  sz= dotLine2.length
  for(let i=0;i<sz;i++){
    dotLine2.pop();
  }

});

//kps actions runner
const kpsPerformActions=(actionArray,delay,pointMap)=>{
  if (actionArray.length === 0) return; 
  const action = actionArray.shift();
  console.log(action);
  if(action[0]==="kagp"){
    let pt=kpsMarkHull(action[1]);
    kpsSVGMap[action[1]].push(pt);
  }
  else if(action[0]==="hidp"){
    for(pt of action[1]){

    }
  }
  setTimeout(() => kpsPerformActions(actionArray, delay), delay);
}