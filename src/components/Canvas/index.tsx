import React, { useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useCanvasStore } from '../../stores/canvasStore';
import ShapeRenderer from './ShapeRenderer.tsx';
// import ImageRenderer from './ImageRenderer';
// import TextRenderer from './TextRenderer';

const Canvas: React.FC = () => {
  const { elements, canvasSize, selectElement } = useCanvasStore();
  const stageRef = useRef<React.ElementRef<typeof Stage>>(null);

  const handleStageClick = (e: React.Konva.KonvaEventObject<MouseEvent>) => {
    // 点击空白处取消选择
    if (e.target === e.target.getStage()) {
      selectElement(null);
    }
  };

  const exportCanvas = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current. toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'poster.png';
      link.href = dataURL;
      link.click();
    }
  };

  // 暴露导出方法
  React.useImperativeHandle(
    useCanvasStore.getState().canvasSize,
    () => ({ exportCanvas })
  );

  return (
    <div>
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleStageClick}
        style={{ border: '1px solid #ddd', background: 'white' }}
      >
        <Layer>
          {elements
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((element) => {
              switch (element.type) {
                case 'shape':
                  return <ShapeRenderer key={element.id} element={element} />;
                // case 'image': 
                //   return <ImageRenderer key={element.id} element={element} />;
                // case 'text':
                //   return <TextRenderer key={element.id} element={element} />;
                default:
                  return null;
              }
            })}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;