"use client";

import { useEffect, useRef, useState, type ComponentProps, type PointerEvent } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type Size = { width: number; height: number };
type Tile = { id: number; x: number; y: number; image: HTMLImageElement };

// Block sizes in CSS px: resolve in, hold sharp, step back out.
const FRAMES = [24, 12, 6, 3, 1, 3, 12, 24];
const FRAME_MS = 70;
const HOLD_MS = 400;
const SHARP = FRAMES.indexOf(1);

// Draws the image cover-fitted at 1/block resolution, then scales it up with
// smoothing off so each block is a hard square. Never reads pixels back, so
// cross-origin images draw without CORS setup.
function draw(canvas: HTMLCanvasElement, small: HTMLCanvasElement, image: HTMLImageElement, block: number, dpr: number) {
  const ctx = canvas.getContext("2d");
  const smallCtx = small.getContext("2d");
  if (!ctx || !smallCtx) return;
  const sw = Math.max(1, Math.round(canvas.width / (block * dpr)));
  const sh = Math.max(1, Math.round(canvas.height / (block * dpr)));
  small.width = sw;
  small.height = sh;
  const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
  const cropW = canvas.width / scale;
  const cropH = canvas.height / scale;
  smallCtx.drawImage(image, (image.naturalWidth - cropW) / 2, (image.naturalHeight - cropH) / 2, cropW, cropH, 0, 0, sw, sh);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(small, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);
}

function TrailTile({ tile, size, onDone }: { tile: Tile; size: Size; onDone: (id: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size.width * dpr);
    canvas.height = Math.round(size.height * dpr);
    const small = document.createElement("canvas");
    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (frame >= FRAMES.length) {
        onDone(tile.id);
        return;
      }
      draw(canvas, small, tile.image, FRAMES[frame], dpr);
      timer = setTimeout(step, frame === SHARP ? HOLD_MS : FRAME_MS);
      frame += 1;
    };
    step();
    return () => clearTimeout(timer);
  }, [tile, size.width, size.height, onDone]);

  return (
    <canvas
      ref={ref}
      className="absolute border-(length:--border-hair) border-line"
      style={{ left: tile.x - size.width / 2, top: tile.y - size.height / 2, width: size.width, height: size.height }}
    />
  );
}

// Host box that drops image tiles behind a mouse or pen. Each tile resolves
// from coarse pixels to sharp, holds, then steps back out and disappears.
// The trail layer is aria-hidden and ignores pointer events, so the children
// stay readable and clickable. No trail for touch, under reduced motion
// (reported until hydration finishes) or without JavaScript.
export function PixelatedImageTrail({
  images,
  spacing = 80,
  size = { width: 160, height: 120 },
  max = 8,
  className,
  children,
  onPointerMove,
  ...props
}: ComponentProps<"div"> & {
  images: string[];
  spacing?: number;
  size?: Size;
  max?: number;
}) {
  const reduced = useReducedMotion();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const loaded = useRef<(HTMLImageElement | null)[]>([]);
  const last = useRef<{ x: number; y: number } | null>(null);
  const next = useRef(0);
  const ids = useRef(0);
  const signature = images.join("\n");

  useEffect(() => {
    const list: (HTMLImageElement | null)[] = images.map(() => null);
    loaded.current = list;
    images.forEach((src, i) => {
      const image = new Image();
      image.onload = () => {
        list[i] = image;
      };
      image.src = src;
    });
    return () => {
      loaded.current = [];
    };
    // `signature` stands in for the array, so a new array with the same URLs does not reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const [removeTile] = useState(() => (id: number) => setTiles((all) => all.filter((t) => t.id !== id)));

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (reduced || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gap = Math.max(1, spacing);
    if (last.current && Math.hypot(x - last.current.x, y - last.current.y) < gap) return;
    const ready = loaded.current;
    for (let tries = 0; tries < ready.length; tries += 1) {
      const index = (next.current + tries) % ready.length;
      const image = ready[index];
      if (!image) continue;
      next.current = index + 1;
      last.current = { x, y };
      ids.current += 1;
      const tile = { id: ids.current, x, y, image };
      setTiles((all) => [...all, tile].slice(-Math.max(1, max)));
      return;
    }
  };

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        last.current = null;
      }}
      {...props}
    >
      {children}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
        {tiles.map((tile) => (
          <TrailTile key={tile.id} tile={tile} size={size} onDone={removeTile} />
        ))}
      </div>
    </div>
  );
}
