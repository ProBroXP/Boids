let flock;
let hash_size;
let last_frame_rate = 0;
let flock_size_slider;
let debug_checkbox;

function printFPS() {
  // update fps every 8 frames to make it easier to see
  if (frameCount % 8 == 0) 
    last_frame_rate = frameRate();
  push();
  textSize(20);
  textAlign(LEFT);
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

  flock_size_slider = createSlider(0, 1000, 150, 1);
  flock_size_slider.position(width - 160, height - 40);
  flock.updateFlockSize(flock_size_slider.value());

  debug_checkbox = createCheckbox("", false);
  debug_checkbox.position(width - 50, height - 70);
  background(50);
}

function draw() {
  background(50);
  flock.updateFlockSize(flock_size_slider.value());
  hash_size = Math.max(
    flock.alignment_radius, 
    flock.cohesion_radius, 
    flock.seperation_radius
  );
  if (debug_checkbox.checked()) flock.spacial_map.show();
  flock.updateAndRender(
    windowWidth,
    windowHeight,
    ...setCells(windowWidth, windowHeight, hash_size)
  );
  textSize(15);
  textAlign(RIGHT);
  text(flock_size_slider.value() + " boids", width - 170, height - 26);
  text("Show grid", width - 55, height - 56);
  printFPS();
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  flock_size_slider.position(width - 160, height - 40);
  debug_checkbox.position(width - 50, height - 70);
  flock.updateFlockSize(flock_size_slider.value());
  flock.updateAndRender(
    windowWidth,
    windowHeight,
    ...setCells(windowWidth, windowHeight, hash_size)
  );
}
