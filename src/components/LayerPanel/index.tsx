import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';

const LayerPanel: React.FC = () => {
  const { elements, selectedId, selectElement, reorderElements, deleteElement } =
    useCanvasStore();

  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className='bg-[var(--custom-layers)] p-4 h-[calc(100vh-64px)] ml-2'>
      <h3>图层</h3>
      {sortedElements.map((element) => (
        <div
          key={element.id}
          onClick={() => selectElement(element.id)}
          className='ml-2 overflow-auto w-3/4 text-lg p-2 my-2 cursor-pointer rounded'
          style={{
            background: selectedId === element.id ?  'var(--custom-bg)' : 'white',
          }}
        >
          <div className='flex justify-between'>
            <span>{element.type} - {element.id. substring(0, 8)}</span>
            <div>
              <button onClick={() => reorderElements(element.id, 'up')}>↑</button>
              <button onClick={() => reorderElements(element.id, 'down')}>↓</button>
              <button onClick={() => deleteElement(element.id)}>×</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayerPanel;