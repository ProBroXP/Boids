function setCells(w, h, d) {
  return [Math.floor(h / d), Math.floor(w / d)];
}

class Flock {
  constructor(w, h, r, c) {
    this.boids = [];
    this.spacial_map = new SpacialHash(w, h, r, c);
    this.w = w;
    this.h = h;
    this.r = r;
    this.c = c;

    this.flock_size = 0;
    this.fov = 4 * PI / 3; // in radians
    this.max_speed = 10;
    this.max_acceleration = 0.08;

    this.seperation_radius = 120;
    this.alignment_radius = 80;
    this.cohesion_radius = 80;

    this.seperation_strength = 2.5;
    this.alignment_strength = 1.4;
    this.cohesion_strength = 3.3;
  }

  updateFlockSize(new_size) {
    if (new_size > this.flock_size)
      for (let i = 0; i < new_size - this.flock_size; i++) {
        let boid = new Boid(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 4 - 2,
          Math.random() * 4 - 2
        );
        this.boids.push(boid);
      }
    else if (new_size < this.flock_size)
      for (let i = 0; i < this.flock_size - new_size; i++)
        this.boids.pop();
    this.flock_size = new_size;
  }

  updateAndRender(w, h, r, c) {
    this.spacial_map = new SpacialHash(w, h, r, c);
    
    for (let b in this.boids) {
      this.boids[b].updatePosition(w, h);

      this.boids[b].hash = this.spacial_map.insert(
        this.boids[b],
        this.boids[b].position.x,
        this.boids[b].position.y
      );
    }

    for (let b in this.boids) {
      this.boids[b].render(this.max_speed);

      let neighbors = this.spacial_map.getNear(this.boids[b].hash);
      
      let seperation = createVector(0, 0);
      let alignment = createVector(0, 0);
      let cohesion = createVector(0, 0);

      let valid_neighbors = 0;
      for (let n in neighbors) {
        let distance = p5.Vector.dist(
          this.boids[b].position, 
          neighbors[n].position
        );
        let heading_diff = 
          this.boids[b].velocity.heading() - 
          neighbors[n].velocity.heading();
        if (heading_diff < PI-this.fov/2 && heading_diff > -PI-this.fov/2) {
          if (distance > 0 && distance < this.seperation_radius) {
            let difference = p5.Vector.sub(
              this.boids[b].position, 
              neighbors[n].position
            );
            difference.normalize();
            difference.div(distance);
            seperation.add(difference);
          }

          if (distance > 0 && distance < this.alignment_radius) {
            alignment.add(neighbors[n].velocity);
          }

          if (distance > 0 && distance < this.cohesion_radius) {
            valid_neighbors++;
            cohesion.add(neighbors[n].position);
          }
        }
      }

      if (seperation.mag() > 0) {
        seperation.normalize();
        seperation.mult(this.max_speed);
        seperation.sub(this.boids[b].velocity);
        seperation.limit(this.max_acceleration);
      }

      alignment.normalize();
      alignment.mult(this.max_speed);
      alignment = p5.Vector.sub(alignment, this.boids[b].velocity);
      alignment.limit(this.max_acceleration);

      if (valid_neighbors != 0) {
        cohesion.div(valid_neighbors);
        cohesion.sub(this.boids[b].position);
        cohesion.normalize();
        cohesion.mult(this.max_speed);
        cohesion.sub(this.boids[b].velocity);
        cohesion.limit(this.max_acceleration);
      }

      this.boids[b].applyForce(seperation.mult(this.seperation_strength));
      this.boids[b].applyForce(alignment.mult(this.alignment_strength));
      this.boids[b].applyForce(cohesion.mult(this.cohesion_strength));
    }
  }
}
