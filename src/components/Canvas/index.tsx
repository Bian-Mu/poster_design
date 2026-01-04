import React, { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect } from 'react-konva';
import { useCanvasStore } from '../../stores/canvasStore';
import ShapeRenderer from './ShapeRenderer';
import TextRenderer from './TextRenderer';
import ImageRenderer from './ImageRenderer';

export type CanvasHandle = {
  exportImage: () => void;
};

const Canvas = React.forwardRef<CanvasHandle>((_props, ref) => {
  const { elements, canvasSize, selectElement } = useCanvasStore();
  const stageRef = useRef<Konva.Stage | null>(null);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) selectElement(null);
  };

const exportImage = () => {
  const stage = stageRef.current;
  if (!stage) return;

  // 取第一个 layer（你现在只有一个 Layer）
  const layer = stage.getLayers()[0];
  if (!layer) return;

  // 1) 临时插入白底到最底层
  const bg = new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    fill: '#ffffff',
    listening: false,
  });
  layer.add(bg);
  bg.moveToBottom();
  layer.draw();

  // 2) 导出（此时一定是白底）
  const dataURL = stage.toDataURL({ pixelRatio: 2 });

  // 3) 清理临时白底
  bg.destroy();
  layer.draw();

  const link = document.createElement('a');
  link.download = `poster-${Date.now()}.png`;
  link.href = dataURL;
  link.click();
};

  React.useImperativeHandle(ref, () => ({ exportImage }), []);

  return (
    <div style={{ display: 'inline-block' }}>
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleStageClick}
        style={{ border: '1px solid #ddd', background: '#fff' }}
      >
        <Layer>
          {/* 画布白底（显示效果 + 导出更直观） */}
          <Rect
            x={0}
            y={0}
            width={canvasSize.width}
            height={canvasSize.height}
            fill="#fff"
            listening={false}
          />

          {elements
            .slice()
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((element) => {
              switch (element.type) {
                case 'shape':
                  return <ShapeRenderer key={element.id} element={element} />;
                case 'text':
                  return <TextRenderer key={element.id} element={element} stageRef={stageRef} />;
                case 'image':
                  return <ImageRenderer key={element.id} element={element} />;
                default:
                  return null;
              }
            })}
        </Layer>
      </Stage>
    </div>
  );
});

Canvas.displayName = 'Canvas';
export default Canvas;