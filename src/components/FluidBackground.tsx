"use client";

import React, { useEffect, useRef } from "react";

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, vx: 0, vy: 0 };
    let blobs: any[] = [];

    const onMouseMove = (e: MouseEvent) => {
      mouse.vx = e.clientX - mouse.x;
      mouse.vy = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Drop a liquid blob at mouse position
      blobs.push({
        x: mouse.x,
        y: mouse.y,
        vx: mouse.vx * 0.05,
        vy: mouse.vy * 0.05,
        radius: 80,
        color: "rgba(255, 255, 255, 0.8)", // Bright white/blue glow
        life: 1.0,
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < blobs.length; i++) {
        let b = blobs[i];
        b.x += b.vx;
        b.y += b.vy;

        // Bounce persistent blobs
        if (b.life === undefined) {
          if (b.x < -b.radius) b.vx = Math.abs(b.vx);
          if (b.x > width + b.radius) b.vx = -Math.abs(b.vx);
          if (b.y < -b.radius) b.vy = Math.abs(b.vy);
          if (b.y > height + b.radius) b.vy = -Math.abs(b.vy);
        } else {
          // Slow down dynamic blobs
          b.vx *= 0.95;
          b.vy *= 0.95;
        }

        // Draw Blob
        ctx.beginPath();
        let grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        
        // Dynamic opacity based on life
        let opacity = b.life !== undefined ? b.life : 1;
        
        // Parse color and apply opacity
        let colorStr = b.color.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/, (m: any, r: any, g: any, bl: any, a: any) => {
          return `rgba(${r}, ${g}, ${bl}, ${(parseFloat(a || 1) * opacity).toFixed(2)})`;
        });

        grad.addColorStop(0, colorStr);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Decay temporary blobs
        if (b.life !== undefined) {
          b.life -= 0.015;
          b.radius += 1;
          if (b.life <= 0) {
            blobs.splice(i, 1);
            i--;
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 w-full h-full -z-30 bg-black" />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-20 pointer-events-none md:pointer-events-auto"
        style={{ 
          filter: "blur(20px) contrast(30)", 
          mixBlendMode: "screen"
        }}
      />
    </>
  );
}
