'use client';

import { useEffect, useRef, useState } from 'react';
import { WIDTH, HEIGHT, PixelEngineType } from './usePixelEngine';

const SCALE = 5;
const PRIMITIVES = ['line', 'rect', 'circle', 'triangle'];

export function PixelCanvas({ engine }: { engine: PixelEngineType }) {
  const {
    currentFrame,
    frames,
    currentFrameIdx,
    showGrid,
    showOnion,
    handleCanvasClickOrDrag,
    applyPrimitiveToFrame,
    brushSize,
    brushShape,
    activeTool,
    color,
  } = engine;

  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const ctx = mainCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

    if (showOnion && currentFrameIdx > 0) {
      const prevFrame = frames[currentFrameIdx - 1];
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++)
          if (prevFrame[y][x] === 1) ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
      }
    }

    ctx.fillStyle = '#FFFFFF';
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++)
        if (currentFrame[y][x] === 1) ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }

    if (showGrid) {
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x <= WIDTH; x++) {
        ctx.moveTo(x * SCALE, 0);
        ctx.lineTo(x * SCALE, HEIGHT * SCALE);
      }
      for (let y = 0; y <= HEIGHT; y++) {
        ctx.moveTo(0, y * SCALE);
        ctx.lineTo(WIDTH * SCALE, y * SCALE);
      }
      ctx.stroke();
    }
  }, [currentFrame, currentFrameIdx, showGrid, showOnion, frames]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left) / SCALE);
    const y = Math.floor((e.clientY - r.top) / SCALE);
    setIsDrawing(true);

    if (PRIMITIVES.includes(activeTool)) {
      setStartPos({ x, y });
    } else {
      handleCanvasClickOrDrag(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = overlayCanvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.floor((e.clientX - rect.left) / SCALE);
    const y = Math.floor((e.clientY - rect.top) / SCALE);

    const ctx = overlayCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

    // Якщо ми ТЯГНЕМО примітив — малюємо прев'ю примітиву
    if (isDrawing && PRIMITIVES.includes(activeTool) && startPos) {
      const previewFrame = applyPrimitiveToFrame(
        Array(HEIGHT)
          .fill(null)
          .map(() => Array(WIDTH).fill(0)),
        startPos.x,
        startPos.y,
        x,
        y,
        activeTool,
        1,
      );
      ctx.fillStyle = color === 1 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(100, 100, 100, 0.5)';
      for (let py = 0; py < HEIGHT; py++) {
        for (let px = 0; px < WIDTH; px++)
          if (previewFrame[py][px] === 1) ctx.fillRect(px * SCALE, py * SCALE, SCALE, SCALE);
      }
      return;
    }

    // Якщо ми малюємо олівцем
    if (isDrawing && activeTool === 'pencil') {
      handleCanvasClickOrDrag(x, y);
    }

    // Прев'ю самого пензлика (якщо не заливка)
    if (activeTool !== 'bucket') {
      ctx.fillStyle = color === 1 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(100, 100, 100, 0.5)';
      const radius = Math.floor(brushSize / 2);
      const isEven = brushSize % 2 === 0;
      for (let py = y - radius; py <= y + radius - (isEven ? 1 : 0); py++) {
        for (let px = x - radius; px <= x + radius - (isEven ? 1 : 0); px++) {
          if (brushShape === 'circle') {
            const dx = px - x + (isEven ? 0.5 : 0);
            const dy = py - y + (isEven ? 0.5 : 0);
            if (dx * dx + dy * dy <= radius * radius)
              ctx.fillRect(px * SCALE, py * SCALE, SCALE, SCALE);
          } else {
            ctx.fillRect(px * SCALE, py * SCALE, SCALE, SCALE);
          }
        }
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && PRIMITIVES.includes(activeTool) && startPos) {
      const rect = overlayCanvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = Math.floor((e.clientX - rect.left) / SCALE);
        const y = Math.floor((e.clientY - rect.top) / SCALE);
        const newFrame = applyPrimitiveToFrame(
          currentFrame,
          startPos.x,
          startPos.y,
          x,
          y,
          activeTool,
          color,
        );
        engine.setFrames((f) => {
          const copy = [...f];
          copy[currentFrameIdx] = newFrame;
          return copy;
        });
      }
    }
    setIsDrawing(false);
    setStartPos(null);
  };

  const clearOverlay = () => {
    setIsDrawing(false);
    setStartPos(null);
    const ctx = overlayCanvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);
  };

  return (
    <div className="relative border border-zinc-800/50 rounded-lg p-2 bg-black mx-auto mt-6 mb-6 inline-block">
      <canvas
        ref={mainCanvasRef}
        width={WIDTH * SCALE}
        height={HEIGHT * SCALE}
        className="bg-black block rounded-md image-render-pixelated"
      />
      <canvas
        ref={overlayCanvasRef}
        width={WIDTH * SCALE}
        height={HEIGHT * SCALE}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={clearOverlay}
        className="absolute top-2 left-2 cursor-crosshair block rounded-md image-render-pixelated"
      />
    </div>
  );
}
