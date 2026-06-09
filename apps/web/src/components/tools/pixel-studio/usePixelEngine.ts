import { useState } from "react";

export const WIDTH = 128;
export const HEIGHT = 64;

export type Tool = "pencil" | "bucket" | "line" | "rect" | "circle" | "triangle";
export type BrushShape = "square" | "circle";

function getLinePoints(x0: number, y0: number, x1: number, y1: number) {
  const pts = [];
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, e2;
  while (true) {
    pts.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
  return pts;
}

function getCirclePoints(x0: number, y0: number, x1: number, y1: number) {
  const pts = [];
  const r = Math.floor(Math.hypot(x1 - x0, y1 - y0));
  let x = 0, y = r;
  let d = 3 - 2 * r;
  while (y >= x) {
    pts.push(
      { x: x0 + x, y: y0 + y }, { x: x0 - x, y: y0 + y }, { x: x0 + x, y: y0 - y }, { x: x0 - x, y: y0 - y },
      { x: x0 + y, y: y0 + x }, { x: x0 - y, y: y0 + x }, { x: x0 + y, y: y0 - x }, { x: x0 - y, y: y0 - x }
    );
    x++;
    if (d > 0) { y--; d = d + 4 * (x - y) + 10; }
    else { d = d + 4 * x + 6; }
  }
  return pts;
}

function getTrianglePoints(x0: number, y0: number, x1: number, y1: number) {
  const mx = Math.floor((x0 + x1) / 2);
  return [
    ...getLinePoints(mx, y0, x1, y1),
    ...getLinePoints(x1, y1, x0, y1),
    ...getLinePoints(x0, y1, mx, y0)
  ];
}

export function usePixelEngine() {
  const [frames, setFrames] = useState<number[][][]>([
    Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(0)),
  ]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  
  const [activeTool, setActiveTool] = useState<Tool>("pencil");
  const [color, setColor] = useState<1 | 0>(1);
  const [brushSize, setBrushSize] = useState(1);
  const [brushShape, setBrushShape] = useState<BrushShape>("square");
  
  const [showGrid, setShowGrid] = useState(true);
  const [showOnion, setShowOnion] = useState(true);

  // ЗАХИСТ ВІД ГОСТІНГУ: Гарантуємо, що currentFrame ніколи не буде undefined
  const safeIdx = Math.max(0, Math.min(currentFrameIdx, frames.length - 1));
  const currentFrame = frames[safeIdx] || frames[0];

  const addFrame = () => {
    setFrames(prev => {
      const blankFrame = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(0));
      return [...prev, blankFrame];
    });
    setCurrentFrameIdx(frames.length);
  };

  const deleteFrame = () => {
    if (frames.length === 1) return;
    setFrames(prev => prev.filter((_, i) => i !== currentFrameIdx));
    setCurrentFrameIdx(prev => Math.max(0, prev - 1));
  };

  const applyBrushMut = (frame: number[][], cx: number, cy: number, val: 1 | 0) => {
    const radius = Math.floor(brushSize / 2);
    const isEven = brushSize % 2 === 0;
    for (let y = cy - radius; y <= cy + radius - (isEven ? 1 : 0); y++) {
      for (let x = cx - radius; x <= cx + radius - (isEven ? 1 : 0); x++) {
        if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
          if (brushShape === "circle") {
            const dx = x - cx + (isEven ? 0.5 : 0);
            const dy = y - cy + (isEven ? 0.5 : 0);
            if (dx * dx + dy * dy <= radius * radius) frame[y][x] = val;
          } else {
            frame[y][x] = val;
          }
        }
      }
    }
  };

  const applyBrush = (frame: number[][], cx: number, cy: number, val: 1 | 0) => {
    const newFrame = frame.map(row => [...row]);
    applyBrushMut(newFrame, cx, cy, val);
    return newFrame;
  };

  const applyFill = (frame: number[][], startX: number, startY: number, fillVal: 1 | 0) => {
    const targetVal = frame[startY][startX];
    if (targetVal === fillVal) return frame;
    const newFrame = frame.map(row => [...row]);
    const queue = [[startX, startY]];
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) continue;
      if (newFrame[y][x] !== targetVal) continue;
      newFrame[y][x] = fillVal;
      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    return newFrame;
  };

  const applyPrimitiveToFrame = (frame: number[][], x0: number, y0: number, x1: number, y1: number, tool: Tool, val: 1 | 0) => {
    let pts: {x: number, y: number}[] = [];
    if (tool === 'line') pts = getLinePoints(x0, y0, x1, y1);
    if (tool === 'rect') pts = [...getLinePoints(x0, y0, x1, y0), ...getLinePoints(x1, y0, x1, y1), ...getLinePoints(x1, y1, x0, y1), ...getLinePoints(x0, y1, x0, y0)];
    if (tool === 'circle') pts = getCirclePoints(x0, y0, x1, y1);
    if (tool === 'triangle') pts = getTrianglePoints(x0, y0, x1, y1);

    const newFrame = frame.map(r => [...r]);
    pts.forEach(p => applyBrushMut(newFrame, p.x, p.y, val));
    return newFrame;
  };

  const handleCanvasClickOrDrag = (x: number, y: number) => {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
    const updatedFrames = [...frames];
    const frame = updatedFrames[safeIdx];
    let newFrame = frame;

    if (activeTool === "pencil") newFrame = applyBrush(frame, x, y, color);
    if (activeTool === "bucket") newFrame = applyFill(frame, x, y, color);

    updatedFrames[safeIdx] = newFrame;
    setFrames(updatedFrames);
  };

  return {
    frames, setFrames, currentFrameIdx, setCurrentFrameIdx, currentFrame,
    activeTool, setActiveTool, color, setColor, brushSize, setBrushSize,
    brushShape, setBrushShape, showGrid, setShowGrid, showOnion, setShowOnion,
    handleCanvasClickOrDrag, applyPrimitiveToFrame, applyBrushMut,
    addFrame, deleteFrame
  };
}

export type PixelEngineType = ReturnType<typeof usePixelEngine>;