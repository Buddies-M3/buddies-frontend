import React, { useEffect, useRef } from 'react';

const SolarSystem = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const imageSize = 150; // Increase the size of the images
    const images = [
      { src: '/assets/images/system/solar-site-01.png', x: 50, y: 125 },
      { src: '/assets/images/system/smeter-01.png', x: 300, y: 125 },
      { src: '/assets/images/system/load-01.png', x: 550, y: 125 },
    ];

    const loadImages = images.map(image => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = image.src;
        img.onload = () => resolve(img);
      });
    });

    Promise.all(loadImages).then(loadedImages => {
      loadedImages.forEach((img, index) => {
        const { x, y } = images[index];
        ctx.drawImage(img, x, y, imageSize, imageSize);
      });
      drawConnections();
    });

    const drawConnections = () => {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;

      // Connect solar panels to house
      ctx.beginPath();
      ctx.moveTo(50 + imageSize, 125 + imageSize / 2);
      ctx.lineTo(300, 125 + imageSize / 2);
      ctx.stroke();

      // Connect house to controllers
      ctx.beginPath();
      ctx.moveTo(300 + imageSize, 125 + imageSize / 2);
      ctx.lineTo(550, 125 + imageSize / 2);
      ctx.stroke();
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <canvas ref={canvasRef} width={800} height={400}></canvas>
    </div>
  );
};

export default SolarSystem;
