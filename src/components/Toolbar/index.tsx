import React, { useRef } from 'react';
import { useCanvasStore } from '../../stores/canvasStore';
import type { ShapeElement, ImageElement, TextElement } from '../../types';
import { HexColorPicker } from 'react-colorful';
import { Button } from 'antd';

const Toolbar: React.FC = () => {
  const { addElement, getSelectedElement, updateElement } = useCanvasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [currentColor, setCurrentColor] = React. useState('#000000');

  const addShape = (shapeType: 'rect' | 'circle' | 'triangle' | 'star') => {
    const shape: ShapeElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      shapeType,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: 0,
      opacity: 1,
      fillColor:  '#3b82f6',
      strokeColor:  '#1e40af',
      strokeWidth: 2,
    };
    addElement(shape);
  };

  const addText = () => {
    const text: TextElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: 0,
      opacity: 1,
      textContent: '双击编辑文本',
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000',
      fontWeight: 'normal',
      textAlign: 'left',
    };
    addElement(text);
  };

  const handleImageUpload = (e: React. ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const image:  ImageElement = {
            id:  `image-${Date.now()}`,
            type: 'image',
            x: 50,
            y: 50,
            width: img.width,
            height: img.height,
            rotation: 0,
            zIndex: 0,
            opacity: 1,
            src: event.target?.result as string,
          };
          addElement(image);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

function darkenHex(hex: string, amount = 30) {
  const h = hex.replace('#', '');
  if (h.length !== 6) return hex;

  const num = parseInt(h, 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);

  return (
    '#' +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

const handleColorChange = (color: string) => {
  setCurrentColor(color);
  const selected = getSelectedElement();
  if (!selected) return;

  if (selected.type === 'shape') {
    updateElement(selected.id, {
      fillColor: color,
      strokeColor: darkenHex(color, 40), 
    });
  } else if (selected.type === 'text') {
    updateElement(selected.id, { color });
  }
};

  return (
    <div className='h-full flex gap-2 items-center'>
      <Button onClick={() => addShape('rect')}>矩形</Button>
      <Button onClick={() => addShape('circle')}>圆形</Button>
      <Button onClick={() => addShape('triangle')}>三角形</Button>
      <Button onClick={() => addShape('star')}>星形</Button>
      <Button onClick={addText}>文本</Button>
      <Button onClick={() => fileInputRef.current?.click()}>导入图片</Button>
      <Button onClick={() => setShowColorPicker(!showColorPicker)}>
        调色板
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

      {showColorPicker && (
        <div className='absolute top-[100px] left-[40px]'>
          <HexColorPicker color={currentColor} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
};

export default Toolbar;