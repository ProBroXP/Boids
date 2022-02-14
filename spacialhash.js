class SpacialHash {
  constructor(width, height, rows, columns) {
    this.width = width;
    this.height = height;
    this.rows = rows;
    this.columns = columns;
    this.cell_width = width / columns;
    this.cell_height = height / rows;

    this.table = Array.from(Array(rows * columns), () => new Array());
  }

  clear() {
    this.table = this.table.map(() => new Array());
  }

  insert(object, x, y) {
    let hash =
      Math.floor(x / this.cell_width) +
      Math.floor(y / this.cell_height) * this.columns;
    this.table[hash].push(object);
    return hash;
  }

  getNear(hash) {
    let neighbors = [];

    let left = false, right = false, top = false, bottom = false;

    // Center
    neighbors = neighbors.concat(this.table[hash]);
    // Left
    if ((hash - 1) % this.columns < hash % this.columns && hash != 0) {
      neighbors = neighbors.concat(this.table[hash - 1]);
      left = true;
    }
    // Right
    if ((hash + 1) % this.columns > hash % this.columns){
      neighbors = neighbors.concat(this.table[hash + 1]);
      right = true;
    }
    // Top
    if (hash + this.columns < this.columns * this.rows){
      neighbors = neighbors.concat(this.table[hash + this.columns]);
      top = true;
    }
    // Bottom
    if (hash - this.columns > 0){
      neighbors = neighbors.concat(this.table[hash - this.columns]);
      bottom = true;
    }

    // Top-Left
    if (top && left) 
      neighbors = neighbors.concat(this.table[hash + this.columns - 1]);
    // Top-Right
    if (top && right) 
      neighbors = neighbors.concat(this.table[hash + this.columns + 1]);
    // Bottom-Left
    if (bottom && left) 
      neighbors = neighbors.concat(this.table[hash - this.columns - 1]);
    // Bottom-Right
    if (bottom && right) 
      neighbors = neighbors.concat(this.table[hash - this.columns + 1]);

    return neighbors;
  }

  show() {
    push();
    stroke(123);
    fill(60);
    strokeWeight(0.5);
    for (let i = 0; i < this.columns; i++)
      for (let j = 0; j < this.rows; j++) {
        let hash = i + j * this.columns;
        if (this.table[hash].length != 0)
          rect(
            i * this.cell_width,
            j * this.cell_height,
            this.cell_width,
            this.cell_height
          );
      }
    pop();
  }
}
