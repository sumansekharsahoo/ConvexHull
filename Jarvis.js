
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
function findNextOrigin(prev_o,o,points){
    let best_angle = 360
    let best_point = null
    // console.log(o)
    for (let i = 0; i < points.length; i++){
        if(JSON.stringify(points[i]) === JSON.stringify(o) || JSON.stringify(points[i]) === JSON.stringify(prev_o)){
            continue
        }
        let angle=findAngle(prev_o,o,points[i])
        if(angle < best_angle){
            best_angle = angle
            best_point = JSON.parse(JSON.stringify(points[i]));
            // console.log(best_point)
        }
        else if(angle == best_angle){
            if(Math.hypot(o.x-best_point.x, o.y-best_point.y)>Math.hypot(o.x-points[i].x, o.y-points[i].y)){
                best_angle = angle
                best_point = JSON.parse(JSON.stringify(points[i]));
            }
        }
        
    }
    return best_point

}
function Jarvis(points){
    let hull = []
    let origin=new Point(Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER)
    for (let i = 0; i < points.length; i++){
        if(origin.y > points[i].y){
            origin = JSON.parse(JSON.stringify(points[i]));
        }
    }
    prev_o = JSON.parse(JSON.stringify(origin));  
    prev_o.x = prev_o.x+0.001
    // console.log(origin)
    hull.push(origin)
    while(true){
        let candidate  = findNextOrigin(prev_o,origin,points)
        if(hull.some((item) => shallowEqualityCheck(item, candidate))){
            break
        }
        hull.push(candidate)
        prev_o = JSON.parse(JSON.stringify(origin));
        origin = JSON.parse(JSON.stringify(candidate));
    }
    

    return hull
}
// for (let i = 0; i < 10; i++) {
//     points.push(new Point(Math.floor((Math.random() * 100) + 1),Math.floor((Math.random() * 100) + 1)))
// } 
// let points =[]
// points.push(new Point(0,0))
// points.push(new Point(2,0))
// points.push(new Point(2,2))
// points.push(new Point(0,2))
// points.push(new Point(1,1))
let points = [
    {x: -7, y: 8},
    {x: -4, y: 6},
    {x: 2, y: 6},
    {x: 6, y: 4},
    {x: 8, y: 6},
    {x: 7, y: -2},
    {x: 4, y: -6},
    {x: 8, y: -7},
    {x: 0, y: 0},
    {x: 3, y: -2},
    {x: 6, y: -10},
    {x: 0, y: -6},
    {x: -9, y: -5},
    {x: -8, y: -2},
    {x: -8, y: 0},
    {x: -10, y: 3},
    {x: -2, y: 2},
    {x: -10, y: 4}
];
console.log(Jarvis(points))