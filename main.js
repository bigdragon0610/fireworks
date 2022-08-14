"use strict";

const COLORS = [
  { inner: "#FAF747", center: "#FB9A4A", outer: "#FF3838" },
  { inner: "#AAF6C2", center: "#AACBFD", outer: "#00AAFF" },
  { inner: "#FD984A", center: "#C49AEE", outer: "#FD46DE" },
  { inner: "#FB9A4A", center: "#FACB8A", outer: "#FCEA37" },
  { inner: "#24B561", center: "#AFDCB7", outer: "#3FF3BB" },
  { inner: "#01BFFF", center: "#01BFFF", outer: "#01FFFF" },
  { inner: "#70D0FE", center: "#00C8FF", outer: "#01FFE1" },
  { inner: "#A01CFF", center: "#5565FF", outer: "#FF1BC2" },
  { inner: "#FF0022", center: "#FEA601", outer: "#FF0055" },
  { inner: "#FF8255", center: "#FFE600", outer: "#FEA601" },
];

const canvas = document.getElementById("canvas");
const WINDOW_WIDTH = document.body.clientWidth;
const WINDOW_HEIGHT = document.documentElement.clientHeight;
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

const rand = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getRandomString = () => {
  const l = 8;
  const c = "abcdefghijklmnopqrstuvwxyz0123456789";
  const cl = c.length;
  let r = "";
  for (let i = 0; i < l; i++) {
    r += c[Math.floor(Math.random() * cl)];
  }
  return r;
};

class fireBall {
  constructor(isParent, id, r, x, y, vx, vy, gv, color, canvas, fireworks) {
    this.isParent = isParent;
    this.id = id;
    this.r = r;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gv = gv;
    this.color = color;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.fireworks = fireworks;
    this.fireworks.addElement(this.id, this);
  }

  explode() {
    const color_set = COLORS[Math.floor(rand(0, COLORS.length))];
    const inner_color = color_set.inner;
    const center_color = color_set.center;
    const outer_color = color_set.outer;
    for (let i = 0; i < 500; i++) {
      const theta = rand(0, Math.PI * 2);
      const s = rand(0, 0.8);
      const vx = Math.cos(theta);
      const vy = -1 * Math.sin(theta);
      let color;
      if (s < 0.1 || (s < 0.3 && Math.random() < 0.3)) {
        color = inner_color;
      } else if (s >= 0.1 && s < 0.7 && Math.random() < 0.5) {
        color = center_color;
      } else {
        color = outer_color;
      }
      new fireBall(
        false,
        getRandomString(),
        2,
        this.x,
        this.y,
        vx * s,
        vy * s,
        1 / 500,
        color,
        this.canvas,
        this.fireworks
      );
    }
  }

  update() {
    if (this.y > WINDOW_HEIGHT) {
      this.fireworks.deleteElement(this.id);
    }
    if (this.isParent && this.vy > 0) {
      this.fireworks.deleteElement(this.id);
      this.explode();
    }
    if (!this.isParent) {
      this.r -= 0.001;
      if (
        (this.r < 1.8 && rand(0, 100) < 1) ||
        (this.r < 1.7 && rand(0, 100) < 2)
      ) {
        this.fireworks.deleteElement(this.id);
      }
    }
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gv;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}

class fireWorks {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.elements = {};
  }

  addElement(key, element) {
    this.elements[key] = element;
  }

  deleteElement(key) {
    delete this.elements[key];
  }

  update() {
    Object.values(this.elements).forEach((element) => {
      element.update();
      element.draw();
    });
  }
}

function mainLoop(fireworks) {
  fireworks.update();
  if (rand(0, 1000) < 4) {
    new fireBall(
      true,
      getRandomString(),
      3,
      rand(0, WINDOW_WIDTH),
      WINDOW_HEIGHT,
      0,
      -1 * rand(2, 4),
      1 / 100,
      "#fcfc00",
      canvas,
      fireworks
    );
  }
  requestAnimationFrame(() => {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    mainLoop(fireworks);
  });
}

const fireworks = new fireWorks(canvas);

mainLoop(fireworks);
