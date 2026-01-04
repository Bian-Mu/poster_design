import Canvas from "./components/Canvas"
import LayerPanel from "./components/LayerPanel"
import Toolbar from "./components/Toolbar"

function App() {

  return (
    <div className='h-[100vh] flex flex-col'>
      <Toolbar/>
      <div className="flex flex-1">
        <div className="flex-1 p-2 overflow-auto">
          <Canvas/>
        </div>
        <LayerPanel/>
      </div>
      <div className="p-1 border-t-2 border-solid border-black">
        <button>清空画布</button>
        <button>导出海报</button>
      </div>
    </div>
  )
}

export default App
