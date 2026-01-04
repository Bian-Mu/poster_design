import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';

const LayerPanel: React.FC = () => {
  const { elements, selectedId, selectElement, reorderElements, deleteElement } =
    useCanvasStore();

  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div style={{ width: '200px', borderLeft: '1px solid #ddd', padding: '10px' }}>
      <h3>图层</h3>
      {sortedElements.map((element) => (
        <div
          key={element.id}
          onClick={() => selectElement(element.id)}
          style={{
            padding: '8px',
            margin: '4px 0',
            background: selectedId === element.id ?  '#e0f2fe' : '#f5f5f5',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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