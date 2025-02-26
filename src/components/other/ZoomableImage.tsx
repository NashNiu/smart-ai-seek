import { useRef, useCallback, useEffect } from "react";

interface ZoomableImageProps {
  src: string;
  maxScale?: number;
  minScale?: number;
}

const ZoomableImage = ({
  src,
  maxScale = 5,
  minScale = 0.1,
}: ZoomableImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scale = useRef(1);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const translate = useRef({ x: 0, y: 0 });

  const updateTransform = useCallback(() => {
    if (!imgRef.current) return;
    imgRef.current.style.transform = `translate(${translate.current.x}px, ${translate.current.y}px) scale(${scale.current})`;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startPos.current = {
      x: e.clientX - translate.current.x,
      y: e.clientY - translate.current.y,
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      translate.current = {
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y,
      };
      updateTransform();
    },
    [updateTransform]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleDoubleClick = useCallback(() => {
    scale.current = 1;
    translate.current = { x: 0, y: 0 };
    updateTransform();
  }, [updateTransform]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = scale.current * delta;

      if (newScale < minScale || newScale > maxScale) return;
      scale.current = newScale;

      const rect = imgRef.current?.getBoundingClientRect();
      const offsetX = e.clientX - (rect?.left ?? 0);
      const offsetY = e.clientY - (rect?.top ?? 0);

      translate.current.x -= offsetX * (delta - 1);
      translate.current.y -= offsetY * (delta - 1);

      updateTransform();
    };

    container.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheelEvent);
    };
  }, [maxScale, minScale, updateTransform]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "600px",
        height: "400px",
        overflow: "hidden",
        position: "relative",
        cursor: isDragging.current ? "grabbing" : "grab",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        ref={imgRef}
        src={src}
        style={{
          position: "absolute",
          transition: "transform 0.1s",
          transformOrigin: "0 0",
          userSelect: "none",
          maxWidth: "none",
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        alt="Zoomable"
        draggable={false}
      />
    </div>
  );
};

export default ZoomableImage;

