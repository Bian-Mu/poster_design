import React from 'react';
import { Rect, Circle, Star, Line, Transformer } from 'react-konva';
import type { ShapeElement } from '../../types';
import { useCanvasStore } from '../../stores/canvasStore';

interface Props {
  element: ShapeElement;
}

const ShapeRenderer: React.FC<Props> = ({ element }) => {
  const { selectedId, selectElement, updateElement } = useCanvasStore();
  const shapeRef = React.useRef<React.ElementRef<typeof Rect> | null>(null);
  const trRef = React.useRef<React.ElementRef<typeof Transformer> | null>(null);

  const isSelected = element.id === selectedId;

  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()!.batchDraw();
    }
  }, [isSelected]);

  const handleSelect = () => {
    selectElement(element.id);
  };

  const handleDragEnd = (e: any) => {
    updateElement(element.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node!.scaleX();
    const scaleY = node!.scaleY();

    node!.scaleX(1);
    node!.scaleY(1);

    updateElement(element.id, {
      x: node!.x(),
      y: node!.y(),
      width: Math.max(5, node!.width() * scaleX),
      height: Math.max(5, node!.height() * scaleY),
      rotation: node!.rotation(),
    });
  };

  const shapeProps = {
    ref: shapeRef,
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    fill: element.fillColor,
    stroke: element.strokeColor,
    strokeWidth: element.strokeWidth,
    rotation: element.rotation,
    opacity: element.opacity,
    draggable: true,
    onClick: handleSelect,
    onTap: handleSelect,
    onDragEnd: handleDragEnd,
    onTransformEnd:  handleTransformEnd,
  };

  const renderShape = () => {
    switch (element.shapeType) {
      case 'rect':
        return <Rect {...shapeProps} />;
      case 'circle': 
        return <Circle {...shapeProps} radius={element.width / 2} />;
      case 'star':
        return (
          <Star
            {...shapeProps}
            numPoints={5}
            innerRadius={element.width / 4}
            outerRadius={element.width / 2}
          />
        );
      case 'triangle':
        const height = element.height;
        const width = element.width;
        return (
          <Line
            {... shapeProps}
            points={[width / 2, 0, width, height, 0, height]}
            closed
            fill={element.fillColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderShape()}
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default ShapeRenderer;