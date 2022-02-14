var flock;
var hash_size;
var debug = false;
var last_frame_rate = 0;

function printFPS() {
  // update fps every 8 frames to make it easier to see
  if (frameCount % 8 == 0) 
    last_frame_rate = frameRate();
  push();
  textSize(20);
  fill(255);
  strokeWeight(0);
  text("fps: " + Math.trunc(last_frame_rate), 5, 20);
  pop();
}

function setup() {
  fill(255);
  createCanvas(windowWidth, windowHeight);
  flock = new Flock(
    windowWidth,
    windowHeight,
    ...setCells(windowWidth, windowHeight, 25)
  );
  hash_size = Math.max(
    flock.alignment_radius, 
    flock.cohesion_radius, 
    flock.seperation_radius
  );
  flock.updateFlockSize(350);
  background(50);
}

function draw() {
  background(50);
  hash_size = Math.max(
    flock.alignment_radius, 
    flock.cohesion_radius, 
    flock.seperation_radius
  );
  if (debug) flock.spacial_map.show();
  flock.updateAndRender(
    windowWidth,
    windowHeight,
    ...setCells(windowWidth, windowHeight, hash_size)
  );
  printFPS();
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  flock.updateAndRender(
    windowWidth,
    windowHeight,
    ...setCells(windowWidth, windowHeight, hash_size)
  );
}
