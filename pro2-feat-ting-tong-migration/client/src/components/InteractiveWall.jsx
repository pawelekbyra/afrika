// Plik: client/src/components/InteractiveWall.jsx

import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const InteractiveWall = ({ onWallDestroyed }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    if (!parent) return;

    // Definicje stałych
    const ceglaSzerokosc = 60;
    const ceglaWysokosc = 30;
    const fugaGrubosc = 1;
    const kolorCegly = '#ffffff';
    const kolorKonturu = '#333333';
    const grawitacja = 0.5;

    let cegly = [];
    let animationFrameId;

    class Cegla {
      constructor(x, y, szerokosc, wysokosc, isStatic = true) {
        this.x = x;
        this.y = y;
        this.szerokosc = szerokosc;
        this.wysokosc = wysokosc;
        this.isStatic = isStatic;
        this.vx = 0;
        this.vy = 0;
        this.kat = 0;
        this.predkoscKatowa = 0;
        this.zniszczona = false;
      }

      draw() {
        if (this.zniszczona) return;
        ctx.save();
        ctx.translate(this.x + this.szerokosc / 2, this.y + this.wysokosc / 2);
        ctx.rotate(this.kat);
        ctx.fillStyle = kolorCegly;
        ctx.fillRect(-this.szerokosc / 2, -this.wysokosc / 2, this.szerokosc, this.wysokosc);
        ctx.strokeStyle = kolorKonturu;
        ctx.lineWidth = fugaGrubosc;
        ctx.strokeRect(-this.szerokosc / 2, -this.wysokosc / 2, this.szerokosc, this.wysokosc);
        ctx.restore();
      }

      update() {
        if (this.isStatic || this.zniszczona) return;
        this.vy += grawitacja;
        this.x += this.vx;
        this.y += this.vy;
        this.kat += this.predkoscKatowa;
        if (this.y > canvas.height + this.wysokosc) {
          this.zniszczona = true;
        }
      }
    }

    const inicjalizujMur = () => {
      cegly = [];
      const szerokoscCeglyZFuga = ceglaSzerokosc + fugaGrubosc;
      const wysokoscCeglyZFuga = ceglaWysokosc + fugaGrubosc;
      const iloscRzedow = Math.ceil(canvas.height / wysokoscCeglyZFuga) + 1;
      const iloscKolumn = Math.ceil(canvas.width / szerokoscCeglyZFuga) + 2;

      for (let rzad = 0; rzad < iloscRzedow; rzad++) {
        const offset = (rzad % 2 !== 0) ? szerokoscCeglyZFuga / 2 : 0;
        for (let kolumna = 0; kolumna < iloscKolumn; kolumna++) {
          let x = kolumna * szerokoscCeglyZFuga - offset;
          const y = rzad * wysokoscCeglyZFuga;
          cegly.push(new Cegla(x, y, ceglaSzerokosc, ceglaWysokosc));
        }
      }
    };

    const niszczMur = (klikX, klikY) => {
      const PROMIEN_DESTRUKCJI = 40;
      const BAZOWA_SILA = 8;

      cegly.forEach(cegla => {
        if (cegla.isStatic && !cegla.zniszczona) {
          const dx = (cegla.x + cegla.szerokosc / 2) - klikX;
          const dy = (cegla.y + cegla.wysokosc / 2) - klikY;
          const dystans = Math.sqrt(dx * dx + dy * dy);

          if (dystans < PROMIEN_DESTRUKCJI) {
            cegla.isStatic = false;
            const katEksplozji = Math.atan2(dy, dx);
            const sila = (PROMIEN_DESTRUKCJI - dystans) / (PROMIEN_DESTRUKCJI / BAZOWA_SILA);
            cegla.vx = -Math.cos(katEksplozji) * sila * (0.8 + Math.random() * 0.4);
            cegla.vy = -Math.sin(katEksplozji) * sila * (0.5 + Math.random() * 0.5) - 5;
            cegla.predkoscKatowa = (Math.random() - 0.5) * 0.4;
          }
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let statyczneCegly = 0;

      cegly.forEach(cegla => {
        if (!cegla.zniszczona) {
          cegla.update();
          cegla.draw();
        }
        if (cegla.isStatic && !cegla.zniszczona) {
          statyczneCegly++;
        }
      });

      cegly = cegly.filter(c => !c.zniszczona);

      if (statyczneCegly === 0 && cegly.length > 0) {
        setTimeout(() => {
          if (onWallDestroyed) onWallDestroyed();
        }, 1500);
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const handleClick = (event) => {
      event.stopPropagation();
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      niszczMur(x, y);
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        canvas.width = entry.contentRect.width;
        canvas.height = entry.contentRect.height;
        inicjalizujMur();
      }
    });

    if (parent) {
      resizeObserver.observe(parent);
    }

    canvas.addEventListener('click', handleClick);
    inicjalizujMur();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleClick);
      if (parent) {
        resizeObserver.unobserve(parent);
      }
    };
  }, [onWallDestroyed]);

  return <canvas ref={canvasRef} className="interactive-canvas" />;
};

InteractiveWall.propTypes = {
  onWallDestroyed: PropTypes.func.isRequired,
};

export default InteractiveWall;
