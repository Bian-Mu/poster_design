import React from 'react';
import Konva from 'konva';
import { Image as KonvaImage, Transformer } from 'react-konva';
import type { ImageElement } from '../../types';
import { useCanvasStore } from '../../stores/canvasStore';

interface Props {
  element: ImageElement;
}

function useHTMLImage(src: string) {
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.src = src;
  }, [src]);

  return image;
}

const ImageRenderer: React.FC<Props> = ({ element }) => {
  const { selectedId, selectElement, updateElement } = useCanvasStore();

  const img = useHTMLImage(element.src);
  const nodeRef = React.useRef<Konva.Image | null>(null);
  const trRef = React.useRef<Konva.Transformer | null>(null);

  const isSelected = element.id === selectedId;

  React.useEffect(() => {
    if (isSelected && trRef.current && nodeRef.current) {
      trRef.current.nodes([nodeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    updateElement(element.id, { x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = () => {
    const node = nodeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    updateElement(element.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(10, node.width() * scaleX),
      height: Math.max(10, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  return (
    <>
      <KonvaImage
        ref={nodeRef}
        image={img ?? undefined}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        opacity={element.opacity}
        draggable
        onClick={() => selectElement(element.id)}
        onTap={() => selectElement(element.id)}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default ImageRenderer;