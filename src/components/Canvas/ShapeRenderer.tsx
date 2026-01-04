import React from 'react';
import Konva from 'konva';
import { Rect, Circle, Star, Line, Transformer } from 'react-konva';
import type { ShapeElement } from '../../types';
import { useCanvasStore } from '../../stores/canvasStore';

interface Props {
  element: ShapeElement;
}

const ShapeRenderer: React.FC<Props> = ({ element }) => {
  const { selectedId, selectElement, updateElement } = useCanvasStore();

  // 给 Transformer 用的“通用 node ref”
  const nodeRef = React.useRef<Konva.Node | null>(null);
  const trRef = React.useRef<Konva.Transformer | null>(null);

  const isSelected = element.id === selectedId;

  React.useEffect(() => {
    if (isSelected && trRef.current && nodeRef.current) {
      trRef.current.nodes([nodeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleSelect = () => selectElement(element.id);

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
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  const commonProps = {
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
    onTransformEnd: handleTransformEnd,
  };

  // 关键：用 callback ref，把具体类型节点塞进 nodeRef（Konva.Node）
  const setNodeRef = (node: Konva.Node | null) => {
    nodeRef.current = node;
  };

  const renderShape = () => {
    switch (element.shapeType) {
      case 'rect':
        return <Rect {...commonProps} ref={(n) => setNodeRef(n)} />;
      case 'circle':
        return (
          <Circle
            {...commonProps}
            radius={element.width / 2}
            ref={(n) => setNodeRef(n)}
          />
        );
      case 'star':
        return (
          <Star
            {...commonProps}
            numPoints={5}
            innerRadius={element.width / 4}
            outerRadius={element.width / 2}
            ref={(n) => setNodeRef(n)}
          />
        );
      case 'triangle': {
        const h = element.height;
        const w = element.width;
        return (
          <Line
            {...commonProps}
            points={[w / 2, 0, w, h, 0, h]}
            closed
            ref={(n) => setNodeRef(n)}
          />
        );
      }
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