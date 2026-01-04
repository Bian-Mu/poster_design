import React, { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer } from 'react-konva';
import { useCanvasStore } from '../../stores/canvasStore';
import ShapeRenderer from './ShapeRenderer.tsx';

const Canvas: React.FC = () => {
  const { elements, canvasSize, selectElement } = useCanvasStore();
  const stageRef = useRef<Konva.Stage | null>(null);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      selectElement(null);
    }
  };

//   const exportCanvas = () => {
//     if (stageRef.current) {
//       const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
//       const link = document.createElement('a');
//       link.download = 'poster.png';
//       link.href = dataURL;
//       link.click();
//     }
//   };

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