import React from 'react';
import { Layout, Button, Space } from 'antd';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';

import Canvas, { type CanvasHandle } from './components/Canvas';
import LayerPanel from './components/LayerPanel';
import Toolbar from './components/Toolbar';
import { useCanvasStore } from './stores/canvasStore';

const { Header, Content, Sider, Footer } = Layout;

function App() {
  const canvasRef = React.useRef<CanvasHandle>(null);
  const clearCanvas = useCanvasStore((s) => s.clearCanvas);

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ background: '#fff' }}>
        <Toolbar />
      </Header>

      <Layout>
        <Content style={{ padding: 12, overflow: 'auto' }}>
          <Canvas ref={canvasRef} />
        </Content>
        <Sider width={260} style={{ background: '#fff', borderLeft: '1px solid #eee' }}>
          <LayerPanel />
        </Sider>
      </Layout>

      <Footer style={{ background: '#fff', borderTop: '1px solid #eee' }}>
        <Space>
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
        </Space>
      </Footer>
    </Layout>
  );
}

export default App;