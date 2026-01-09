import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { pointsByRoad  } from "./data/all_roads_walking_paths"
import MapPage from "./pages/MapPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path='/' element={<MapPage appKey={import.meta.env.VITE_KAKAO_JS_KEY } pointsByRoad={pointsByRoad}/>}/>

        <Route path='/map' element={<MapPage appKey={import.meta.env.VITE_KAKAO_JS_KEY } pointsByRoad={pointsByRoad}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
