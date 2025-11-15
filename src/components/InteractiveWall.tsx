
"use client";

import React, { useRef, useEffect } from 'react';

interface InteractiveWallProps {
  onWallDestroyed: () => void;
}

const InteractiveWall: React.FC<InteractiveWallProps> = ({ onWallDestroyed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Particle[] = [];
    const numberOfParticles = 100;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    if (canvas) {
      const init = () => {
        particles = [];
        for (let i = 0; i < numberOfParticles; i++) {
          particles.push(new Particle(canvas));
        }
      }

      const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
          if (particles[i].size <= 0.3) {
            particles.splice(i, 1);
            i--;
          }
        }
        if (particles.length === 0) {
          onWallDestroyed();
        }
        requestAnimationFrame(animate);
      }

      init();
      animate();
    }

  }, [onWallDestroyed]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }} />;
};

export default InteractiveWall;
