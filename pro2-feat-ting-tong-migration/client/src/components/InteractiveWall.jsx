
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// Przeniesienie klasy Cegla poza komponent
class Cegla {
  constructor(x, y, szerokosc, wysokosc, isStatic = true) {
    this.x = x;
    this.y = y;
    this.szerokosc = szerokosc;
    this.wysokosc = wysokosc;
    this.isStatic = isStatic;
    this.color = '#B22222';
    this.znika = false;
    this.alpha = 1.0;
  }

  rysuj(ctx) {
    if (this.znika) {
      this.alpha -= 0.05;
      if (this.alpha < 0) this.alpha = 0;
    }
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.szerokosc, this.wysokosc);
    ctx.globalAlpha = 1.0;
  }
}

const InteractiveWall = ({ onWallDestroyed }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let cegly = [];
    let mysz = { x: 0, y: 0, isDown: false };
    let animationFrameId;

    const inicjalizujMur = () => {
      cegly = [];
      const szerokoscCegly = 50;
      const wysokoscCegly = 20;
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
          cegly.push(new Cegla(i * szerokoscCegly, j * wysokoscCegly, szerokoscCegly - 1, wysokoscCegly - 1));
        }
      }
    };

    const petlaAnimacji = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cegly.forEach(cegla => cegla.rysuj(ctx));
      animationFrameId = requestAnimationFrame(petlaAnimacji);
    };

    const handleMouseDown = (e) => {
      mysz.isDown = true;
      const rect = canvas.getBoundingClientRect();
      mysz.x = e.clientX - rect.left;
      mys.y = e.clientY - rect.top;
      sprawdzKolizje();
    };

    const sprawdzKolizje = () => {
      cegly.forEach(cegla => {
        if (mysz.x > cegla.x && mysz.x < cegla.x + cegla.szerokosc &&
            mysz.y > cegla.y && mysz.y < cegla.y + cegla.wysokosc) {
          cegla.znika = true;
        }
      });

      if (cegly.every(c => c.alpha <= 0)) {
        onWallDestroyed();
      }
    };

    inicjalizujMur();
    petlaAnimacji();
    canvas.addEventListener('mousedown', handleMouseDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onWallDestroyed]);

  return <canvas ref={canvasRef} width="250" height="80" />;
};

InteractiveWall.propTypes = {
  onWallDestroyed: PropTypes.func.isRequired,
};

export default InteractiveWall;
