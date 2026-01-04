import React from 'react';
import {  Button } from 'antd';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';

import Canvas, { type CanvasHandle } from './components/Canvas';
import LayerPanel from './components/LayerPanel';
import Toolbar from './components/Toolbar';
import { useCanvasStore } from './stores/canvasStore';


function App() {
  const canvasRef = React.useRef<CanvasHandle>(null);
  const clearCanvas = useCanvasStore((s) => s.clearCanvas);

  return (
    <div>
      <div className='pl-4 pr-8 bg-gray-200 flex flex-row h-[64px] justify-between items-center'>
        <Toolbar />
        <div className='flex gap-2'>
          <Button danger icon={<DeleteOutlined />} onClick={clearCanvas}>
            清空画布
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => canvasRef.current?.exportImage()}
          >
            导出海报
          </Button>
        </div>
      </div>

      <div className='flex flex-row h-[calc(100vh-64px)]'>
        <div className='bg-gray-300 p-2 overflow-auto w-[calc(100vw-400px)]'>
          <Canvas ref={canvasRef} />
        </div>
        <div className='absolute right-0 w-[400px] bg-white border-l border-gray-200'>
          <LayerPanel />
        </div>
      </div>
    </div>
  );
}

export default App;