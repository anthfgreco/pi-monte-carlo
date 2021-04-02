param = {
  "insideColor": {
    r: 0,
    g: 255,
    b: 0
  },
  "outsideColor": {
    r: 255,
    g: 0,
    b: 0
  },
  "pointsInCircle": 0,
  "totalPoints": 0,
  "pi": 0.0,
  "Speed": 100,
  "drawEveryXthPoint": 40,
  "totalPointsText": "0",
  "pointsInCircleText": "0"
}

funcs = {
  "Reset Canvas": function() {
    repeatSetup();
  },
  "Add 100M Points": function() {
    param["totalPoints"] += 100_000_000;
    param["pointsInCircle"] += Math.floor((Math.PI/4) * 100_000_000.0); // using pi to calculate pi, 300 iq
  },
  "View Source": function() {
    window.open("https://github.com/anthfgreco/pi-monte-carlo");
  }
}

function setup() {
  repeatSetup();

  let gui = new dat.GUI();
  circlePointsGUI = gui.add(param, "pointsInCircleText").name('Points in Circle').listen();
  circlePointsGUI.__input.disabled = true;
  totalPointsGUI = gui.add(param, "totalPointsText").name('Total Points').listen();
  totalPointsGUI.__input.disabled = true;
  piGUI = gui.add(param, "pi").step(0.000001).name('Pi Esimate').listen();
  piGUI.__input.disabled = true;
  gui.add(param, "Speed", 1, 1000);
  let bgFolder = gui.addFolder("Inside Color");
  bgFolder.add(param.insideColor, "r", 0, 255);
  bgFolder.add(param.insideColor, "g", 0, 255);
  bgFolder.add(param.insideColor, "b", 0, 255);
  let tileFolder = gui.addFolder("Outside Color");
  tileFolder.add(param.outsideColor, "r", 0, 255);
  tileFolder.add(param.outsideColor, "g", 0, 255);
  tileFolder.add(param.outsideColor, "b", 0, 255);
  gui.add(funcs, "Reset Canvas");  
  gui.add(funcs, "Add 100M Points"); 
  gui.add(funcs, "View Source");
}

function repeatSetup() {
  param["pointsInCircle"] = 0;
  param["totalPoints"] = 0;
  param["pi"] = 0;
  
  createCanvas(windowWidth, windowHeight);
  background(255, 255, 255);
  radius = min(windowHeight, windowWidth)/3;

  fill(255,255,255);
  square(windowWidth/2 - radius, windowHeight/2 - radius, radius*2);

  fill(255,255,255);
  circle(windowWidth/2, windowHeight/2, radius*2);
}

function windowResized() {
  repeatSetup();
}

function draw() {
  var i=0
  while (i < (param["Speed"]*100)) {
    let x = (Math.random() * radius*2) + windowWidth/2 - radius;
    let y = (Math.random() * radius*2) + windowHeight/2 - radius;
    
    if (pointInCircle(x, y, windowWidth/2, windowHeight/2, radius)) {
      param["pointsInCircle"]++;
      // Don't draw every point to reduce lag
      if (i%param["drawEveryXthPoint"] == 0) {
        stroke(color(param.insideColor.r, param.insideColor.g, param.insideColor.b));
        point(x, y);
      }
    }
    else {
      // Don't draw every point to reduce lag
      if (i%param["drawEveryXthPoint"] == 0) {
        stroke(color(param.outsideColor.r, param.outsideColor.g, param.outsideColor.b));
        point(x, y);
      }
    }

    param["totalPoints"]++;
    i++;
  }

  param["totalPointsText"] = numberWithCommas(param["totalPoints"]);
  param["pointsInCircleText"] = numberWithCommas(param["pointsInCircle"]);
  param["pi"] = 4 * (param["pointsInCircle"]/param["totalPoints"]);
  //console.log(param["totalPoints"] + " points. Pi = " + param["pi"]);
}

function pointInCircle(x, y, cx, cy, radius) {
  let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius*radius;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}