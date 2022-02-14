class Boid {
  constructor(p_x = 0, p_y = 0, v_x = 0, v_y = 0) {
    this.position = createVector(p_x, p_y);
    this.velocity = createVector(v_x, v_y);
    this.acceleration = createVector(0, 0);
    this.size = 14;
    this.hash = null;
  }

  render(max_speed) {
    let theta = this.velocity.heading();
    push();

    // Color the boid according to the magnitude of its velocity
    colorMode(HSB, 255);
    fill(200 - ((this.velocity.mag() / max_speed) * 185 + 15), 128, 128);
    stroke(200 - ((this.velocity.mag() / max_speed) * 185 + 15), 128, 128);

    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();

    vertex(this.size / 2, 0);
    vertex(-this.size / 2, -this.size / 3);
    vertex(-this.size / 3, 0);
    vertex(-this.size / 2, this.size / 3);

    endShape(CLOSE);
    pop();
  }

  updatePosition(w, h) {
    this.position.add(p5.Vector.mult(this.velocity, deltaTime / 16));
    this.velocity.add(this.acceleration);
    this.acceleration = createVector(0, 0);

    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = w-1;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = h-1;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }
}
