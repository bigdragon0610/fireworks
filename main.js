"use strict";

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
  constructor(id, x, y, vx, vy, gv, canvas, fireworks) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gv = gv;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.fireworks = fireworks;
    this.fireworks.addElement(this.id, this);
  }

  update() {
    if (this.vy > 0) {
      this.fireworks.deleteElement(this.id);
    }
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gv;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#fcfc00";
    this.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
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
  if (Object.keys(fireworks.elements).length === 0) return;
  fireworks.update();
  requestAnimationFrame(() => {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    mainLoop(fireworks);
  });
}

const fireworks = new fireWorks(canvas);

new fireBall(
  getRandomString(),
  rand(0, WINDOW_WIDTH),
  WINDOW_HEIGHT,
  0,
  -1 * rand(2, 4),
  1 / 100,
  canvas,
  fireworks
);

mainLoop(fireworks);
