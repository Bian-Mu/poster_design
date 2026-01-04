import React from 'react';
import Konva from 'konva';
import { Text, Transformer } from 'react-konva';
import type { TextElement } from '../../types';
import { useCanvasStore } from '../../stores/canvasStore';

interface Props {
  element: TextElement;
  stageRef: React.RefObject<Konva.Stage | null>;
}

const TextRenderer: React.FC<Props> = ({ element, stageRef }) => {
  const { selectedId, selectElement, updateElement } = useCanvasStore();

  const nodeRef = React.useRef<Konva.Text | null>(null);
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
      fontSize: Math.max(8, (element.fontSize ?? 24) * scaleY),
    });
  };

  const startEditing = () => {
    const stage = stageRef.current;
    const textNode = nodeRef.current;
    if (!stage || !textNode) return;

    selectElement(element.id);

    const container = stage.container();
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = container.getBoundingClientRect();

    // Konva 坐标 -> 页面坐标
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = element.textContent ?? '';
    textarea.style.position = 'absolute';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${Math.max(40, element.width)}px`;
    textarea.style.height = `${Math.max(24, element.height)}px`;
    textarea.style.fontSize = `${element.fontSize ?? 24}px`;
    textarea.style.fontFamily = element.fontFamily ?? 'Arial';
    textarea.style.color = element.color ?? '#000';
    textarea.style.padding = '0';
    textarea.style.margin = '0';
    textarea.style.border = '1px solid #1890ff';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.background = 'white';
    textarea.style.lineHeight = '1.2';
    textarea.style.transformOrigin = 'left top';
    textarea.style.transform = `rotate(${element.rotation ?? 0}deg)`;

    textarea.focus();
    textarea.select();

    const removeTextarea = () => {
      textarea.parentNode?.removeChild(textarea);
      window.removeEventListener('click', handleOutsideClick);
    };

    const commit = () => {
      updateElement(element.id, { textContent: textarea.value });
      removeTextarea();
    };

    const cancel = () => {
      removeTextarea();
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== textarea) commit();
    };

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
      // Enter 提交；Shift+Enter 换行
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        commit();
      }
    });

    textarea.addEventListener('blur', () => commit());
    setTimeout(() => window.addEventListener('click', handleOutsideClick));
  };

  return (
    <>
      <Text
        ref={nodeRef}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        text={element.textContent}
        fontSize={element.fontSize ?? 24}
        fontFamily={element.fontFamily ?? 'Arial'}
        fill={element.color ?? '#000'}
        align={element.textAlign ?? 'left'}
        rotation={element.rotation}
        opacity={element.opacity}
        draggable
        onClick={() => selectElement(element.id)}
        onTap={() => selectElement(element.id)}
        onDblClick={startEditing}
        onDblTap={startEditing}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default TextRenderer;