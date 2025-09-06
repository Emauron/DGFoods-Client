import { Outlet } from 'react-router-dom';
import CopyrightBottom from "./components/copyright/CopyrightBottom";

function App() {
  return (
    <div>
      <Outlet />
      <CopyrightBottom />
    </div>
  )
}

export default App;