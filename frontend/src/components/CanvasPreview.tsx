import React, { useEffect, useRef, useState } from 'react';
import type { Rectangle } from '../types';

interface CanvasPreviewProps {
  svgWidth: number;
  svgHeight: number;
  items: Rectangle[];
}

interface HoveredRect {
  rect: Rectangle;
  x: number;
  y: number;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ svgWidth, svgHeight, items }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredRect, setHoveredRect] = useState<HoveredRect | null>(null);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const PADDING = 20;

  useEffect(() => {
    drawCanvas();
  }, [items, hoveredRect]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Calculate scale factor to fit SVG in canvas with padding
    const availableWidth = CANVAS_WIDTH - 2 * PADDING;
    const availableHeight = CANVAS_HEIGHT - 2 * PADDING;
    const scaleX = availableWidth / svgWidth;
    const scaleY = availableHeight / svgHeight;
    const scale = Math.min(scaleX, scaleY);

    // Calculate offset to center the drawing
    const scaledWidth = svgWidth * scale;
    const scaledHeight = svgHeight * scale;
    const offsetX = PADDING + (availableWidth - scaledWidth) / 2;
    const offsetY = PADDING + (availableHeight - scaledHeight) / 2;

    // Draw background
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(offsetX, offsetY, scaledWidth, scaledHeight);

    // Draw border around SVG area
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(offsetX, offsetY, scaledWidth, scaledHeight);

    // Draw rectangles
    items.forEach((rect) => {
      const x = offsetX + rect.x * scale;
      const y = offsetY + rect.y * scale;
      const width = rect.width * scale;
      const height = rect.height * scale;

      // Fill rectangle
      ctx.fillStyle = rect.fill;
      ctx.fillRect(x, y, width, height);

      // Highlight out-of-bounds or hovered rectangles
      const isOutOfBounds = rect.issues?.includes('OUT_OF_BOUNDS');
      const isHovered = hoveredRect?.rect === rect;

      if (isOutOfBounds || isHovered) {
        ctx.strokeStyle = isOutOfBounds ? '#ff0000' : '#000000';
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.strokeRect(x, y, width, height);
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate scale and offset (same as in drawCanvas)
    const availableWidth = CANVAS_WIDTH - 2 * PADDING;
    const availableHeight = CANVAS_HEIGHT - 2 * PADDING;
    const scaleX = availableWidth / svgWidth;
    const scaleY = availableHeight / svgHeight;
    const scale = Math.min(scaleX, scaleY);

    const scaledWidth = svgWidth * scale;
    const scaledHeight = svgHeight * scale;
    const offsetX = PADDING + (availableWidth - scaledWidth) / 2;
    const offsetY = PADDING + (availableHeight - scaledHeight) / 2;

    // Check if mouse is over any rectangle
    let found = false;
    for (const item of items) {
      const x = offsetX + item.x * scale;
      const y = offsetY + item.y * scale;
      const width = item.width * scale;
      const height = item.height * scale;

      if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height) {
        setHoveredRect({ rect: item, x: mouseX, y: mouseY });
        found = true;
        break;
      }
    }

    if (!found) {
      setHoveredRect(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredRect(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          border: '2px solid #333',
          cursor: hoveredRect ? 'pointer' : 'default',
        }}
      />
      {hoveredRect && (
        <div
          style={{
            position: 'absolute',
            left: hoveredRect.x + 10,
            top: hoveredRect.y + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div><strong>Position:</strong> ({hoveredRect.rect.x}, {hoveredRect.rect.y})</div>
          <div><strong>Size:</strong> {hoveredRect.rect.width} × {hoveredRect.rect.height}</div>
          <div><strong>Fill:</strong> {hoveredRect.rect.fill}</div>
          {hoveredRect.rect.issues && hoveredRect.rect.issues.length > 0 && (
            <div style={{ color: '#ff6b6b' }}>
              <strong>Issues:</strong> {hoveredRect.rect.issues.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasPreview;
