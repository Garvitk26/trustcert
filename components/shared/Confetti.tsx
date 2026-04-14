"use client";

import React, { useEffect, useRef } from "react";

export interface ConfettiOptions {
  particleCount?: number;
  duration?: number;
  colors?: string[];
}

export function triggerConfetti(options: ConfettiOptions = {}) {
  const {
    particleCount = 150,
    duration = 3000,
    colors = ["#f59e0b", "#f97316", "#eab308", "#f59e0b", "#06b6d4", "#f43f5e", "#0ea5e9", "#ffffff"]
  } = options;

  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles: any[] = [];

  class Particle {
    x = Math.random() * width;
    y = Math.random() * height - height;
    r = Math.random() * 6 + 4;
    d = Math.random() * particleCount;
    color = colors[Math.floor(Math.random() * colors.length)];
    tilt = Math.floor(Math.random() * 10) - 10;
    tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    tiltAngle = 0;

    draw() {
      ctx.beginPath();
      ctx.lineWidth = this.r / 2;
      ctx.strokeStyle = this.color;
      ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
      ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
      ctx.stroke();
    }

    update() {
      this.tiltAngle += this.tiltAngleIncremental;
      this.y += (Math.cos(this.d) + 3 + this.r / 2) / 2;
      this.tilt = Math.sin(this.tiltAngle) * 15;
      if (this.y > height) {
        this.y = -20;
        this.x = Math.random() * width;
      }
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let startTime = Date.now();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.draw();
      p.update();
    });

    if (Date.now() - startTime < duration) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  }

  animate();

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

export default function Confetti() {
  return null; // This is a helper component, used via triggerConfetti()
}
