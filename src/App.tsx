import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import type { JSX } from 'react';
// import MapPage from "./pages/MapPage";


function PrivateRoute({ children }: { children: JSX.Element }) {
  // 로컬 스토리지에 토큰이 있는지 확인
  const token = localStorage.getItem("accessToken");
  
  // 토큰 있으면 통과(children), 없으면 로그인 페이지로 이동
  return token ? children : <Navigate to="/login" replace />;
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MapPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
